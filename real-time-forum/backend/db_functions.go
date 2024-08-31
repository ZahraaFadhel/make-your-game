package realForum

import (
	"database/sql"
	"fmt"
	"log"
)

func CreateTables(db *sql.DB) {
	// users table
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS Users (
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
		Nickname TEXT UNIQUE NOT NULL,
		Email TEXT UNIQUE NOT NULL,
		FirstName TEXT NOT NULL,
		LastName TEXT NOT NULL,
		Age INTEGER NOT NULL,
		Gender TEXT NOT NULL,
		Password TEXT NOT NULL,
		DateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
		IsOnline BOOLEAN DEFAULT FALSE
	);`)
	if err != nil {
		log.Printf("error creating Users table: %v", err)
	} else {
		fmt.Println("Users table created successfully")
	}

	// posts table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS Posts (
		PostID INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID INTEGER NOT NULL,
		PostText TEXT NOT NULL,
		PostDate DATETIME DEFAULT CURRENT_TIMESTAMP,
		LikeCount INTEGER DEFAULT 0,
		DislikeCount INTEGER DEFAULT 0,
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating Posts table: %v", err)
	} else {
		fmt.Println("Posts table created successfully")
	}

	// comments table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS Comments (
		CommentID INTEGER PRIMARY KEY AUTOINCREMENT,
		PostID INTEGER NOT NULL,
		UserID INTEGER NOT NULL,
		CommentText TEXT NOT NULL,
		CommentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
		LikeCount INTEGER DEFAULT 0,
		DislikeCount INTEGER DEFAULT 0,
		FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating Comments table: %v", err)
	} else {
		fmt.Println("Comments table created successfully")
	}

	// categories table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS Categories (
		CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
		CategoryName TEXT UNIQUE NOT NULL
	);`)
	if err != nil {
		log.Printf("error creating Categories table: %v", err)
	} else {
		fmt.Println("Categories table created successfully")
	}

	// sessions table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS Sessions (
		SessionID TEXT PRIMARY KEY,
		UserID INTEGER NOT NULL,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		ExpiresAt DATETIME NOT NULL,
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating Sessions table: %v", err)
	} else {
		fmt.Println("Sessions table created successfully")
	}

	// post likes table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS PostLikes (
		UserID INTEGER,
		PostID INTEGER,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (UserID, PostID),
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating PostLikes table: %v", err)
	} else {
		fmt.Println("PostLikes table created successfully")
	}

	// post dislikes table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS PostDislikes (
		UserID INTEGER,
		PostID INTEGER,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (UserID, PostID),
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating PostDislikes table: %v", err)
	} else {
		fmt.Println("PostDislikes table created successfully")
	}

	// comment likes table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS CommentLikes (
		UserID INTEGER,
		CommentID INTEGER,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (UserID, CommentID),
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (CommentID) REFERENCES Comments(CommentID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating CommentLikes table: %v", err)
	} else {
		fmt.Println("CommentLikes table created successfully")
	}

	// comment dislikes table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS CommentDislikes (
		UserID INTEGER,
		CommentID INTEGER,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (UserID, CommentID),
		FOREIGN KEY (UserID) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (CommentID) REFERENCES Comments(CommentID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating CommentDislikes table: %v", err)
	} else {
		fmt.Println("CommentDislikes table created successfully")
	}

	// post categories table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS PostCategories (
		PostID INTEGER,
		CategoryID INTEGER,
		FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating PostCategories table: %v", err)
	} else {
		fmt.Println("PostCategories table created successfully")
	}

	// ChatMsgs table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS ChatMsgs (
		MessageID INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID1 INTEGER,
		UserID2 INTEGER,
		MsgText TEXT NOT NULL,
		CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (UserID1) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
		FOREIGN KEY (UserID2) REFERENCES Users(UserID) ON UPDATE CASCADE ON DELETE CASCADE
	);`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("ChatMsgs table created successfully")
	}

	// INSERT CATEGORIES
	_, err = db.Exec(`INSERT INTO Categories (CategoryID, CategoryName) VALUES (1, 'Random');
	`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("CATEGORIES inserted successfully")
	}

	_, err = db.Exec(`INSERT INTO Categories (CategoryID, CategoryName) VALUES (2, 'Technology');
	`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("CATEGORIES inserted successfully")
	}

	_, err = db.Exec(`INSERT INTO Categories (CategoryID, CategoryName) VALUES (3, 'Health');
	`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("CATEGORIES inserted successfully")
	}

	_, err = db.Exec(`INSERT INTO Categories (CategoryID, CategoryName) VALUES (4, 'Science');
	`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("CATEGORIES inserted successfully")
	}

	_, err = db.Exec(`INSERT INTO Categories (CategoryID, CategoryName) VALUES (5, 'Art');
	`)
	if err != nil {
		log.Printf("error creating ChatMsgs table: %v", err)
	} else {
		fmt.Println("CATEGORIES inserted successfully")
	}

}
