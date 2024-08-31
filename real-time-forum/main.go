package main

import (
	"database/sql"
	"log"
	"net/http"
	realForum "realForum/backend"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	var err error
	realForum.Db, err = sql.Open("sqlite3", "./forum.db")
	if err != nil {
		log.Fatal(err)
	}
	defer realForum.Db.Close()

	// Test the connection
	err = realForum.Db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	_, err = realForum.Db.Exec("PRAGMA journal_mode=WAL;")
	if err != nil {
		log.Fatalf("Error setting journal_mode: %v", err)
	}

	realForum.CreateTables(realForum.Db)

	// Serve static files
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	t := http.FileServer(http.Dir("templates"))
	http.Handle("/templates/", http.StripPrefix("/templates/", t))

	js := http.FileServer(http.Dir("js"))
	http.Handle("/js/", http.StripPrefix("/js/", js))

	http.HandleFunc("/register", realForum.RootHandler)
	http.HandleFunc("/login", realForum.LoginHandler)
	// http.HandleFunc("/user-data", realForum.GettUser)

	http.HandleFunc("/", realForum.RootHandler)
	http.HandleFunc("/ws", realForum.HandleConnections)


	http.HandleFunc("/posts", realForum.GetAllPosts)
	http.HandleFunc("/logout", realForum.LogoutHandler)

	go realForum.HandleMessages()

	log.Print("http://localhost:8080/")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Listen And Serve: %v", err)
	}
}
