package database

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"invman/api/internal/app/config"

	_ "github.com/lib/pq"
)

var (
	ErrUniqueViolation = errors.New("row is not unique")
)

type Database struct {
	db       *sql.DB
	connPool connPool
}

type connPool interface {
	Exec(statement string, args ...interface{}) (sql.Result, error)
	Query(statement string, args ...interface{}) (*sql.Rows, error)
	QueryRow(statement string, args ...interface{}) *sql.Row
}

func New(config config.DatabaseConfig) *Database {
	pgConn, err := sql.Open("postgres", fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		config.Host,
		config.User,
		config.Password,
		config.Db,
		config.Port,
		config.SSL,
	))

	if err != nil {
		panic(err)
	}

	return &Database{
		db:       pgConn,
		connPool: pgConn,
	}
}

func (database *Database) Connection() *sql.DB {
	return database.db
}

func (database *Database) Exec(statement string, args ...interface{}) (sql.Result, error) {
	return database.connPool.Exec(parseStatement(statement), args...)
}

func (database *Database) Query(statement string, args ...interface{}) (*sql.Rows, error) {
	return database.connPool.Query(parseStatement(statement), args...)
}

func (database *Database) QueryRow(statement string, args ...interface{}) *sql.Row {
	return database.connPool.QueryRow(parseStatement(statement), args...)
}

func (database *Database) Transaction(fc func() error) (err error) {
	panicked := true

	transaction, err := database.db.Begin()

	if err != nil {
		return
	}

	database.connPool = transaction

	defer func() {
		// Make sure to rollback when panic, Block error or Commit error
		if panicked || err != nil {
			transaction.Rollback()
		}

		// Switch back to default connection
		database.connPool = database.db
	}()

	if err = fc(); err == nil {
		panicked = false

		if c, ok := database.connPool.(*sql.Tx); ok {
			return c.Commit()
		}
	}

	return
}

func parseStatement(statement string) string {
	argumentNumber := 1
	for strings.Contains(statement, "?") {
		statement = strings.Replace(statement, "?", fmt.Sprintf("$%d", argumentNumber), 1)
		argumentNumber++
	}

	return statement
}
