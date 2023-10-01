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

type database struct {
	connection     *sql.DB
	connectionPool connPool
}

type Database interface {
	Connection() *sql.DB
	Exec(statement string, args ...interface{}) (sql.Result, error)
	Query(statement string, args ...interface{}) (*sql.Rows, error)
	QueryRow(statement string, args ...interface{}) *sql.Row
	Transaction(fc func() error) (err error)
}

type connPool interface {
	Exec(statement string, args ...interface{}) (sql.Result, error)
	Query(statement string, args ...interface{}) (*sql.Rows, error)
	QueryRow(statement string, args ...interface{}) *sql.Row
}

func New(config config.DatabaseConfig) Database {
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

	return &database{
		connection:     pgConn,
		connectionPool: pgConn,
	}
}

func (database *database) Connection() *sql.DB {
	return database.connection
}

func (database *database) Exec(statement string, args ...interface{}) (sql.Result, error) {
	return database.connectionPool.Exec(parseStatement(statement), args...)
}

func (database *database) Query(statement string, args ...interface{}) (*sql.Rows, error) {
	return database.connectionPool.Query(parseStatement(statement), args...)
}

func (database *database) QueryRow(statement string, args ...interface{}) *sql.Row {
	return database.connectionPool.QueryRow(parseStatement(statement), args...)
}

func (database *database) Transaction(fc func() error) (err error) {
	panicked := true

	transaction, err := database.connection.Begin()

	if err != nil {
		return
	}

	database.connectionPool = transaction

	defer func() {
		// Make sure to rollback when panic, Block error or Commit error
		if panicked || err != nil {
			transaction.Rollback()
		}

		// Switch back to default connection
		database.connectionPool = database.connection
	}()

	if err = fc(); err == nil {
		panicked = false

		if c, ok := database.connectionPool.(*sql.Tx); ok {
			return c.Commit()
		}
	}

	return
}

// Changes ? arguments to $1, $2, etc
func parseStatement(statement string) string {
	argumentNumber := 1
	for strings.Contains(statement, "?") {
		statement = strings.Replace(statement, "?", fmt.Sprintf("$%d", argumentNumber), 1)
		argumentNumber++
	}

	return statement
}
