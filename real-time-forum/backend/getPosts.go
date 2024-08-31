package realForum

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type PostWithUsername struct {
	PostID       int      `json:"post_id"`
	UserID       int      `json:"user_id"`
	Username     string   `json:"username"`
	PostText     string   `json:"post_text"`
	PostDate     string   `json:"post_date"`
	LikeCount    int      `json:"like_count"`
	DislikeCount int      `json:"dislike_count"`
	Categories   []string `json:"categories"`
}

func GetAllPosts(w http.ResponseWriter, r *http.Request) {
	rows, err := Db.Query(`
        SELECT 
            p.PostID, 
            p.UserID, 
            p.PostText, 
            p.PostDate, 
            p.LikeCount, 
            p.DislikeCount, 
            u.Nickname, 
            GROUP_CONCAT(c.CategoryName) AS categories 
        FROM Posts p
        JOIN Users u ON p.UserID = u.UserID
        JOIN PostCategories pc ON p.PostID = pc.PostID
        JOIN Categories c ON pc.CategoryID = c.CategoryID
        GROUP BY p.PostID
        ORDER BY p.PostDate DESC
    `)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []PostWithUsername

	for rows.Next() {
		var post PostWithUsername
		var categoriesString string
		err := rows.Scan(&post.PostID, &post.UserID, &post.PostText, &post.PostDate, &post.LikeCount, &post.DislikeCount, &post.Username, &categoriesString)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		post.Categories = strings.Split(categoriesString, ",")
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		fmt.Println("Error iterating over database results: ", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(posts)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	fmt.Println("GetAllPosts end")
}

// func splitCategories(categories string) []string {
// 	if categories == "" {
// 		return []string{}
// 	}
// 	return strings.Split(categories, ",")
// }

// func getCookie(r *http.Request, w http.ResponseWriter, name string) (string, bool) {
// 	cookie, err := r.Cookie(name)
// 	if err != nil {
// 		return "", false
// 	}
// 	return cookie.Value, true
// }
