package database

import (
	"database/sql"
	"fmt"

	"invman/auth/internal/app/config"

	_ "github.com/lib/pq"
)

func NewConn(cnf *config.DbConfig) *sql.DB {
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		cnf.Host,
		cnf.User,
		cnf.Password,
		cnf.DbName,
		cnf.Port,
		cnf.SSL,
	)
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		panic(err)
	}

	return db
}
