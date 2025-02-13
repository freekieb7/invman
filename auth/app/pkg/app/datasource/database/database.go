package database

import (
	"database/sql"
	"errors"
	"fmt"

	"invman/auth/internal/app/config"

	_ "github.com/lib/pq"
)

var (
	ErrUniqueViolation = errors.New("row is not unique")
)

type Database struct {
	db       *sql.DB
	ConnPool ConnPool
}

type ConnPool interface {
	Exec(statement string, args ...interface{}) (sql.Result, error)
	Query(statement string, args ...interface{}) (*sql.Rows, error)
	QueryRow(statement string, args ...interface{}) *sql.Row
}

func New(cnf config.DbConfig) *Database {
	db, err := sql.Open("postgres", fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		cnf.Host,
		cnf.User,
		cnf.Password,
		cnf.Db,
		cnf.Port,
		cnf.SSL,
	))

	if err != nil {
		panic(err)
	}

	return &Database{
		db:       db,
		ConnPool: db,
	}
}

func (database *Database) Database() *sql.DB {
	return database.db
}

func (database *Database) Transaction(fc func() error) (err error) {
	panicked := true

	transaction, err := database.db.Begin()

	if err != nil {
		return
	}

	database.ConnPool = transaction

	defer func() {
		// Make sure to rollback when panic, Block error or Commit error
		if panicked || err != nil {
			transaction.Rollback()
		}

		// Switch back to default connection
		database.ConnPool = database.db
	}()

	if err = fc(); err == nil {
		panicked = false

		if c, ok := database.ConnPool.(*sql.Tx); ok {
			return c.Commit()
		}
	}

	return
}
