package realForum

import (
	"database/sql"
	"time"
)

var Db *sql.DB // Declare db globally
var CookieName = "forum_session"
var SessionDuration = 24 * time.Hour // Session duration (24 hours)

type User struct {
	UserID    int       `json:"user_id"`
	Email     string    `json:"email"`
	FirstName string    `json:"firstname"`
	LastName  string    `json:"firstname"`
	Age       int       `json:"age"`
	Gender    string    `json:"gender"`
	Nickname  string    `json:"nickname"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"date_created"`
	IsOnline  bool      `json:"isOnline"`
}

type Post struct {
	PostID       int      `json:"post_id"`
	UserID       int      `json:"user_id"`
	PostText     string   `json:"post_text"`
	PostDate     string   `json:"post_date"`
	LikeCount    int      `json:"like_count"`
	DislikeCount int      `json:"dislike_count"`
	Categories   []string `json:"categories"`
}

type ChatMsg struct {
	MessageID   int    `json:"message_id"`
	User1ID     int    `json:"user1_id"`
	User2ID     int    `json:"user2_id"`
	MessageText string `json:"message_text"`
	CreatedAt   string `json:"date_created"`
}

type Comment struct {
	CommentID    int    `json:"comment_id"`
	PostID       int    `json:"post_id"`
	UserID       int    `json:"user_id"`
	CommentText  string `json:"comment_text"`
	CommentDate  string `json:"comment_date"`
	LikeCount    int    `json:"like_count"`
	DislikeCount int    `json:"dislike_count"`
}

type Category struct {
	CategoryID   int    `json:"category_id"`
	CategoryName string `json:"category_name"`
}

type Session struct {
	SessionID string    `json:"id"`
	UserID    int       `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type PostLikes struct {
	UserID    int       `json:"user_id"`
	PostID    int       `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}

type PostDislikes struct {
	UserID    int       `json:"user_id"`
	PostID    int       `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}

type CommentLikes struct {
	UserID    int       `json:"user_id"`
	CommentID int       `json:"comment_id"`
	CreatedAt time.Time `json:"created_at"`
}

type CommentDislikes struct {
	UserID    int       `json:"user_id"`
	CommentID int       `json:"comment_id"`
	CreatedAt time.Time `json:"created_at"`
}

// STRUCTS NOT IN DATABASE
type UserProfile struct {
	Username       string
	Email          string
	CreatedAt      time.Time
	Posts          []Post
	Comments       []Comment
	LikedPosts     []PostLikes
	DislikedPosts  []PostDislikes
	PostCount      int
	CommentCount   int
	LikedPostCount int
	DislikeCount   int
}

type SentMsg struct {
	Type    string  `json:"type"`
	Post    Post    `json:"post"`
	Comment Comment `json:"comment"`
}
