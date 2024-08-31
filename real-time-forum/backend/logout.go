package realForum

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(CookieName)
	if err != nil {
		if err == http.ErrNoCookie {
			// No session to log out from
			fmt.Println("No session to log out from")
			return
		}
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

	// Deferred function to handle rollback
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback() // Rollback on panic
			panic(p)          // Re-throw panic after rollback
		} else if err != nil {
			_ = tx.Rollback() // Rollback on error
		}
		// Do nothing if no panic or error (i.e., if commit was successful)
	}()

	// Delete the session from the database
	_, err = tx.Exec("DELETE FROM Sessions WHERE SessionID = ?", cookie.Value)
	if err != nil {
		log.Printf("Error deleting Session: %v", err)
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

	// Invalidate the session cookie
	cookie = &http.Cookie{
		Name:     "forum_session",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode, // Change to http.SameSiteNoneMode for testing
	}
	http.SetCookie(w, cookie)

	// Ensure it returns a valid JSON response
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{"status": "success"}
	jsonResponse, _ := json.Marshal(response)
	w.Write(jsonResponse)
	fmt.Println("Logged out successfully")
}
