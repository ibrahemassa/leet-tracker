package main

import (
	"log"

	"ibrahemassa/stats_service/database"
	"ibrahemassa/stats_service/routes"

	_ "github.com/mattn/go-sqlite3"
)

func init_db() {
	db := database.Get_connection()
	defer db.Close()

	create_user_table := `
	CREATE TABLE IF NOT EXISTS users (
	id int PRIMARY KEY,
	total_solved INTEGER DEFAULT 0
	);
	`

	create_difficulty_stats_table := `
	CREATE TABLE IF NOT EXISTS difficulty_stats (
	user_id int,
	difficulty TEXT,
	count INTEGER DEFAULT 0,
	PRIMARY KEY(user_id, difficulty),
	FOREIGN KEY(user_id) REFERENCES users(id)
	);
	`

	create_tag_stats_table := `
	CREATE TABLE IF NOT EXISTS tag_stats (
	user_id int,
	tag TEXT,
	count INTEGER DEFAULT 0,
	PRIMARY KEY(user_id, tag),
	FOREIGN KEY(user_id) REFERENCES users(id)
	);
	`

	_, err1 := db.Exec(create_user_table)
	_, err2 := db.Exec(create_difficulty_stats_table)
	_, err3 := db.Exec(create_tag_stats_table)

	if err1 != nil {
		log.Fatalf("Error creating user table: %v", err1)
	}
	if err2 != nil {
		log.Fatalf("Error creating difficulty stats table: %v", err2)
	}
	if err3 != nil {
		log.Fatalf("Error creating tag stats table: %v", err3)
	}

	log.Println("Tables created!")
}

func main() {
	init_db()
	routes.Router()
}
