package realForum

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type SentMsgWithUsername struct {
	Msg      SentMsg
	Username string
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan SentMsgWithUsername)

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	fmt.Println("HandleConnections")
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	clients[ws] = true

	for {
		var msg SentMsg
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("ReadJSON: %v", err)
			delete(clients, ws)
			break
		}

		loggedInUser := GetUser(w, r)
		postID, err := InsertPostIntoDatabase(msg.Post, msg.Post.Categories, loggedInUser.UserID)
		if err != nil {
			log.Printf("Error inserting post into database: %v", err)
			return
		}

		// Fetch the username based on UserID
		username, err := fetchUsernameByUserID(loggedInUser.UserID)
		if err != nil {
			log.Printf("Error fetching username: %v", err)
			return
		}

		msg.Post.PostID = postID
		msg.Post.UserID, err = fetchUserIDByUsername(username)
		if err != nil {
			log.Printf("Error fetching userId: %v", err)
			return
		}

		// Create a new struct with msg and username
		messageWithUsername := SentMsgWithUsername{
			Msg:      msg,
			Username: username,
		}

		// Broadcast the message with the username included
		broadcast <- messageWithUsername
	}
}

func HandleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("WriteJSON: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func fetchUsernameByUserID(userID int) (string, error) {
	var username string
	query := "SELECT Nickname FROM Users WHERE UserID = ?"
	err := Db.QueryRow(query, userID).Scan(&username)
	if err != nil {
		return "", err
	}
	return username, nil
}

func fetchUserIDByUsername(username string) (int, error) {
	var userID int
	query := "SELECT UserID FROM Users WHERE Nickname = ?"
	err := Db.QueryRow(query, username).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

func getCookie(r *http.Request, w http.ResponseWriter, name string) (string, error) {
	cookie, err := r.Cookie(name)
	if err != nil {
		return "", err
	}
	return cookie.Value, nil
}

func GetUser(w http.ResponseWriter, r *http.Request) (User) {
	sessionID, err := getCookie(r, w, CookieName)
	if err != nil {
		fmt.Println("Error getting cookie: ", err)
		return User{}
	}

	fmt.Println("sessionIDDDDDD: ", sessionID)
	var userID int
	err = Db.QueryRow("SELECT UserID FROM Sessions WHERE SessionID = ?", sessionID).Scan(&userID)
	if err != nil {
		fmt.Println("Not a valid session")
		return User{}
	}
	fmt.Println("UserIDDDDDDD: ", userID)

	var user User
	user.UserID = userID

	err = Db.QueryRow("SELECT Nickname, Email, FirstName, LastName, Age, Gender, Password, DateCreated, IsOnline FROM Users WHERE UserID = ?", userID).Scan(&user.Nickname , &user.Email, &user.FirstName, &user.LastName, &user.Age, &user.Gender,  &user.Password, &user.CreatedAt, &user.IsOnline)
	if err != nil {
		fmt.Println("error fetching user: ", err)
	}

	fmt.Println("User: ", user)
	return user
}