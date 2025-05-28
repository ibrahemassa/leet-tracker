package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func Get_connection() *sql.DB {
	db, err := sql.Open("sqlite3", "./stats_db.db")
	if err != nil {
		log.Fatal(err)
	}

	return db
}
