package routes

import (
	"fmt"
	"ibrahemassa/stats_service/database"
	"ibrahemassa/stats_service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func get_stats(user_id int) (*models.UserStats, error) {
	db := database.Get_connection()
	defer db.Close()
	var total_solved int

	_, err := db.Exec("INSERT OR IGNORE INTO users (id, total_solved) VALUES (?, 0)", user_id)
	if err != nil {
		return nil, fmt.Errorf("error (user): %v", err)
	}

	err = db.QueryRow("SELECT total_solved FROM users WHERE id=?", user_id).Scan(&total_solved)
	if err != nil {
		return nil, fmt.Errorf("error fetching total_solved: %v", err)
	}

	difficulty_stats := make(map[string]int)
	rows, err := db.Query("SELECT difficulty, count FROM difficulty_stats WHERE user_id=?", user_id)
	if err != nil {
		return nil, fmt.Errorf("error fetching difficulty_stats: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var difficulty string
		var count int
		err := rows.Scan(&difficulty, &count)
		if err != nil {
			return nil, fmt.Errorf("error scanning difficulty_stats: %v", err)
		}
		difficulty_stats[difficulty] = count
	}

	tags_stat := make(map[int]int)
	rows, err = db.Query("SELECT tag, count FROM tag_stats WHERE user_id=?", user_id)
	if err != nil {
		return nil, fmt.Errorf("error fetching tag_stats: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var tag, count int
		err := rows.Scan(&tag, &count)
		if err != nil {
			return nil, fmt.Errorf("error scanning tag_stats: %v", err)
		}
		tags_stat[tag] = count
	}

	return &models.UserStats{
		UserID:          user_id,
		TotalSolved:     total_solved,
		DifficultyStats: difficulty_stats,
		TagsStat:        tags_stat,
	}, nil
}

func get_stats_handler(c *gin.Context) {
	user_id, _ := strconv.Atoi(c.Param("user_id"))
	stats, err := get_stats(user_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func add_submission(user_id int, submission models.Submission) error {
	db := database.Get_connection()
	defer db.Close()

	difficulty := submission.Difficulty
	tags := submission.Tags

	_, err := db.Exec("INSERT OR IGNORE INTO users (id, total_solved) VALUES (?, 0)", user_id)
	if err != nil {
		return fmt.Errorf("error (user): %v", err)
	}

	_, err = db.Exec(`UPDATE users SET total_solved = total_solved + 1 WHERE id = ?`, user_id)
	if err != nil {
		return fmt.Errorf("error (user): %v", err)
	}

	_, err = db.Exec("INSERT OR IGNORE INTO difficulty_stats (user_id, difficulty, count) VALUES (?, ?, 0)", user_id, difficulty)
	if err != nil {
		return fmt.Errorf("error (difficulty_stats): %v", err)
	}

	_, err = db.Exec("UPDATE difficulty_stats SET count = count + 1 WHERE user_id = ? AND difficulty = ?", user_id, difficulty)
	if err != nil {
		return fmt.Errorf("error (difficulty_stats): %v", err)
	}

	for _, tag := range tags {
		_, err = db.Exec("INSERT OR IGNORE INTO tag_stats (user_id, tag, count) VALUES (?, ?, 0)", user_id, tag)
		if err != nil {
			return fmt.Errorf("error (tag_stats): %v", err)
		}

		_, err = db.Exec("UPDATE tag_stats SET count = count + 1 WHERE user_id = ? AND tag = ?", user_id, tag)
		if err != nil {
			return fmt.Errorf("error (tag_stats): %v", err)
		}
	}

	return nil
}

func add_submission_handler(c *gin.Context) {
	user_id, _ := strconv.Atoi(c.Param("user_id"))
	var submission models.Submission

	err := c.BindJSON(&submission)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid submission format"})
		return
	}

	fmt.Printf("DEBUG: Received submission for user %d: %+v\n", user_id, submission)
	err = add_submission(user_id, submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Submission added!"})
}

func delete_submission(user_id int, submission models.Submission) error {
	db := database.Get_connection()
	defer db.Close()

	difficulty := submission.Difficulty
	tags := submission.Tags

	_, err := db.Exec(`
		UPDATE users 
		SET total_solved = MAX(total_solved - 1, 0) 
		WHERE id = ?`, user_id)
	if err != nil {
		return fmt.Errorf("error updating total_solved: %v", err)
	}

	_, err = db.Exec(`
		UPDATE difficulty_stats 
		SET count = MAX(count - 1, 0) 
		WHERE user_id = ? AND difficulty = ?`, user_id, difficulty)
	if err != nil {
		return fmt.Errorf("error updating difficulty_stats: %v", err)
	}

	for _, tag := range tags {
		_, err = db.Exec(`
			UPDATE tag_stats 
			SET count = MAX(count - 1, 0) 
			WHERE user_id = ? AND tag = ?`, user_id, tag)
		if err != nil {
			return fmt.Errorf("error updating tag_stats: %v", err)
		}
	}

	return nil
}

func delete_submission_handler(c *gin.Context) {
	user_id, _ := strconv.Atoi(c.Param("user_id"))
	var submission models.Submission

	err := c.BindJSON(&submission)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid submission format"})
		return
	}

	fmt.Printf("DEBUG: Received submission for user %d: %+v\n", user_id, submission)
	err = delete_submission(user_id, submission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Submission deleted!"})
}

func Router() {
	router := gin.Default()
	router.GET("/stats/:user_id", get_stats_handler)
	router.POST("/submission/:user_id", add_submission_handler)
	router.DELETE("/submission/:user_id", delete_submission_handler)

	router.Run("127.0.0.1:8002")
}
