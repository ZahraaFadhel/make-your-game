package realForum

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func RootHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		t, err := template.ParseFiles("templates/index.html")
		if err != nil {
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html")
		err = t.Execute(w, nil)
		if err != nil {
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
	} else if r.Method == http.MethodPost {
		// SIGN UP
		email := r.FormValue("email")
		firstName := r.FormValue("first-name")
		lastName := r.FormValue("last-name")
		age := r.FormValue("age")
		gender := r.FormValue("gender")
		nickname := r.FormValue("nickname")
		password := r.FormValue("password")

		nickname = strings.TrimSpace(strings.ToUpper(nickname[:1]) + strings.ToLower(nickname[1:]))
		firstName = strings.TrimSpace(strings.ToUpper(firstName[:1]) + strings.ToLower(firstName[1:]))
		lastName = strings.TrimSpace(strings.ToUpper(lastName[:1]) + strings.ToLower(lastName[1:]))

		// if(email == "" || firstName == "" || lastName == "" || age == "" ||){
		// 	showErrorMsg();
		// }

		// Check if nickname or email already exists
		var count int
		err := Db.QueryRow("SELECT COUNT(*) FROM Users WHERE Nickname = ? OR Email = ?", nickname, email).Scan(&count)
		if err != nil {
			log.Printf("Error checking existing user: %v", err)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		if count > 0 {
			// Username or email already exists
			fmt.Println("Nickname or email already exists")
			return
		}

		// Hash the password
		hashedPassword, err := HashPassword(password)
		if err != nil {
			log.Printf("Error hashing password: %v", err)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		// Start a transaction
		tx, err := Db.Begin()
		if err != nil {
			log.Printf("Error starting transaction: %v", err)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
		defer tx.Rollback() // Roll back the transaction if it's not committed

		// Prepare the SQL statement

		stmt, err := tx.Prepare("INSERT INTO Users(Nickname, Email, FirstName, LastName, Age, Gender, Password, DateCreated, IsOnline) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			log.Printf("Error preparing SQL statement: %v", err)
			http.Error(w, "Error preparing SQL statement", http.StatusInternalServerError)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		// Execute the statement
		result, err := stmt.Exec(nickname, email, firstName, lastName, age, gender, hashedPassword, time.Now(), true)
		if err != nil {
			log.Printf("Error inserting user: %v", err)
			http.Error(w, "Error inserting user", http.StatusInternalServerError)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		// Commit the transaction
		err = tx.Commit()
		if err != nil {
			log.Printf("Error committing transaction: %v", err)
			http.Error(w, "Error committing transaction", http.StatusInternalServerError)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		lastInsertID, err := result.LastInsertId()
		if err != nil {
			log.Printf("Error getting last inserted ID: %v", err)
		} else {
			log.Printf("Last inserted ID: %d", lastInsertID)
		}

		// Create a new session
		sessionID := uuid.New().String()
		expiresAt := time.Now().Add(24 * time.Hour) // Set session to expire after 24 hours

		rows, err := Db.Query("SELECT UserID FROM Users WHERE Nickname = ?", nickname)
		if err != nil {
			fmt.Println("error: SELECT UserID FROM Users WHERE Nickname ")
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var userID int
		err = Db.QueryRow("SELECT UserID FROM Users WHERE Nickname = ?", nickname).Scan(&userID)
		if err != nil {
			fmt.Println("Error selecting UserID from Users table")
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		// Insert the session into the database
		_, err = Db.Exec("INSERT INTO Sessions (SessionID, UserID, CreatedAt, ExpiresAt) VALUES (?, ?, ?, ?)", sessionID, userID, time.Now(), expiresAt)
		if err != nil {
			log.Printf("Error inserting session: %v", err)
			ErrorHandler(w, r, http.StatusInternalServerError)
			return
		}

		cookie := &http.Cookie{
			Name:     "forum_session",
			Value:    sessionID,
			Expires:  expiresAt,
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode, // Change to http.SameSiteNoneMode for testing
		}
		http.SetCookie(w, cookie)
		log.Printf("Set-Cookie: %s=%s; Path=%s; Expires=%s; HttpOnly=%t; SameSite=%s",
			cookie.Name, cookie.Value, cookie.Path, cookie.Expires, cookie.HttpOnly, cookie.SameSite)

		log.Printf("Sign up successful for user: %s, session ID: %s", nickname, sessionID)

		var user User
		err = Db.QueryRow("SELECT Nickname, Email, FirstName, LastName, Age, Gender, Password, DateCreated, IsOnline FROM Users WHERE UserID = ?", userID).Scan(&user.Nickname, &user.Email, &user.FirstName, &user.LastName, &user.Age, &user.Gender, &user.Password, &user.CreatedAt, &user.IsOnline)
		if err != nil {
			log.Printf("Error querying user: %v", err)
			fmt.Println("Invalid username or password")
			// showErrorMsg();
			return
		}

		// Ensure it returns a valid JSON response
		w.Header().Set("Content-Type", "application/json")
		response := map[string]string{"status": "success", "nickname": user.Nickname}
		jsonResponse, _ := json.Marshal(response)
		w.Write(jsonResponse)
	}
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	signinInput := r.FormValue("signin-input")
	signinPassword := r.FormValue("signin-password")

	// Determine if the input is an email or a nickname
	isEmail, err := regexp.MatchString(`^[^\s@]+@[^\s@]+\.[^\s@]+$`, signinInput)
	if err != nil {
		log.Printf("Error validating input: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	// Start a transaction
	tx, err := Db.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	var user User
	if isEmail {
		err = tx.QueryRow("SELECT * FROM Users WHERE Email = ?", signinInput).Scan(&user.UserID, &user.Nickname, &user.Email, &user.FirstName, &user.LastName, &user.Age, &user.Gender, &user.Password, &user.CreatedAt, &user.IsOnline)
	} else {
		signinInput = strings.ToUpper(signinInput[:1]) + strings.ToLower(signinInput[1:])
		err = tx.QueryRow("SELECT * FROM Users WHERE Nickname = ?", signinInput).Scan(&user.UserID, &user.Nickname, &user.Email, &user.FirstName, &user.LastName, &user.Age, &user.Gender, &user.Password, &user.CreatedAt, &user.IsOnline)
	}

	if err != nil {
		log.Printf("Error querying user: %v", err)
		fmt.Println("Invalid username or password")
		return
	}

	// Update the IsOnline column
	_, err = Db.Exec("UPDATE Users SET IsOnline = ? WHERE UserID = ?", true, user.UserID)
	if err != nil {
		log.Printf("Error updating IsOnline column: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	// Compare the hashed password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(signinPassword))
	if err != nil {
		log.Printf("Password mismatch for user: %s", signinInput)
		return
	}

	// Create a new session
	sessionID := uuid.New().String()
	expiresAt := time.Now().Add(24 * time.Hour) // Set session to expire after 24 hours

	// Insert the session into the database
	_, err = Db.Exec("INSERT INTO Sessions (SessionID, UserID, CreatedAt, ExpiresAt) VALUES (?, ?, ?, ?)", sessionID, user.UserID, time.Now(), expiresAt)
	if err != nil {
		log.Printf("Error inserting session: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		log.Printf("Error committing transaction: %v", err)
		ErrorHandler(w, r, http.StatusInternalServerError)
		return
	}

	// Set the session cookie
	cookie := &http.Cookie{
		Name:     "forum_session",
		Value:    sessionID,
		Expires:  expiresAt,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // Change to http.SameSiteNoneMode for testing
	}
	http.SetCookie(w, cookie)
	log.Printf("Set-Cookie: %s=%s; Path=%s; Expires=%s; HttpOnly=%t; SameSite=%s",
		cookie.Name, cookie.Value, cookie.Path, cookie.Expires, cookie.HttpOnly, cookie.SameSite)

	log.Printf("Login successful for user: %s, session ID: %s", signinInput, sessionID)

	validateSession(r, w, sessionID)
	
	// Ensure it returns a valid JSON response
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{"status": "success", "nickname": user.Nickname}
	jsonResponse, _ := json.Marshal(response)
	w.Write(jsonResponse)
}

// validateSession checks if the session ID exists and is still valid
func validateSession(r *http.Request, w http.ResponseWriter, sessionID string) (bool, int) {
	var expiresAt time.Time
	var userID int
	// Query the database for the session
	err := Db.QueryRow("SELECT ExpiresAt, UserID FROM Sessions WHERE SessionID = ?", sessionID).Scan(&expiresAt, &userID)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("Session ID not found: %s", sessionID)
			return false, 0
		}
		log.Printf("Error querying session: %v", err)
		return false, 0
	}
	// Check if the session has expired
	if time.Now().After(expiresAt) {
		log.Printf("Session ID expired: %s", sessionID)
		return false, 0
	}
	return true, userID
}

func isAuthenticated(r *http.Request, w http.ResponseWriter) bool {
	cookie, err := r.Cookie("forum_session")
	if err != nil {
		log.Println("No session cookie found")
		log.Printf("Cookies received: %v", r.Cookies())
		return false
	}
	log.Printf("Session cookie found: %s", cookie.Value)
	// Validate the session ID from the cookie with your session store
	return validateSession2(r, w, cookie.Value)
}

func validateSession2(r *http.Request, w http.ResponseWriter, sessionID string) bool {
	var expiresAt time.Time
	var userID int
	// Query the database for the session
	err := Db.QueryRow("SELECT ExpiresAt, UserID FROM Sessions WHERE ID = ?", sessionID).Scan(&expiresAt, &userID)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("Session ID not found: %s", sessionID)
			return false
		}
		log.Printf("Error querying session: %v", err)
		return false
	}
	// Check if the session has expired
	if time.Now().After(expiresAt) {
		log.Printf("Session ID expired: %s", sessionID)
		return false
	}
	// Count the number of Sessions for the user
	var count int
	err = Db.QueryRow("SELECT COUNT(*) FROM Sessions WHERE UserID = ?", userID).Scan(&count)
	if err != nil {
		log.Printf("Error counting number of Sessions: %v", err)
		return false
	}
	// Delete the oldest session if more than one session exists
	if count > 1 {
		var oldestSessionID string
		err = Db.QueryRow("SELECT ID FROM Sessions WHERE UserID = ? ORDER BY CreatedAt ASC LIMIT 1", userID).Scan(&oldestSessionID)
		if err != nil {
			log.Printf("Error fetching oldest session ID: %v", err)
			return false
		}
		_, err = Db.Exec("DELETE FROM Sessions WHERE ID = ?", oldestSessionID)
		if err != nil {
			log.Printf("Error deleting oldest session: %v", err)
			return false
		}
		log.Printf("Deleted oldest session: %s", oldestSessionID)
		// Update the expiration time of the current session
		newExpiration := time.Now().Add(4 * time.Hour) // Example: extending the session by 4 hours
		_, err = Db.Exec("UPDATE Sessions SET ExpiresAt = ? WHERE ID = ?", newExpiration, sessionID)
		if err != nil {
			log.Printf("Error updating session expiration: %v", err)
			return false
		}
		log.Printf("Updated expiration time for session: %s", sessionID)
	}
	return true
}
