package realForum

import "fmt"

func InsertPostIntoDatabase(post Post, selectedCategories []string, UserID int) (int, error) {
	fmt.Println(selectedCategories)

	// Begin a new transaction
	tx, err := Db.Begin()
	if err != nil {
		fmt.Println("failed to begin transaction:", err)
		return 0, err
	}
	defer func() {
		// Rollback the transaction if commit wasn't successful
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p) // re-throw panic after Rollback
		} else if err != nil {
			tx.Rollback() // if there's an error, rollback
		} else {
			err = tx.Commit() // commit if all is good
		}
	}()

	// Insert the post into the Posts table
	query := `INSERT INTO Posts (UserID, PostText, PostDate, LikeCount, DislikeCount)
	          VALUES (?, ?, ?, ?, ?)`

	// HERE IS THE ERROR WE SHOULD GET THE USERID FROM SEESIONS TABLE
	result, err := tx.Exec(query, UserID, post.PostText, post.PostDate, post.LikeCount, post.DislikeCount)
	if err != nil {
		fmt.Println("failed to insert post:", err)
		return 0, err
	}

	// Get the last inserted PostID
	postID, err := result.LastInsertId()
	if err != nil {
		fmt.Println("failed to get last inserted post ID:", err)
		return 0, err
	}
	fmt.Printf("Post with PostId = %v inserted successfully into Posts table\n", postID)

	// Insert categories into PostCategories table
	for _, category := range selectedCategories {
		fmt.Println("Inserting category:", category)
		categoryQuery := `INSERT INTO PostCategories (PostID, CategoryID) VALUES (?, (SELECT CategoryID FROM Categories WHERE CategoryName = ?))`
		_, err = tx.Exec(categoryQuery, postID, category)
		if err != nil {
			fmt.Println("failed to insert category:", err)
			return 0, err
		}
		fmt.Printf("Category with CategoryName = %v inserted successfully into PostCategories table\n", category)
	}

	// Return the PostID if everything is successful
	return int(postID), nil
}
