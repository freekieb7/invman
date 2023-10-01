package database

import (
	"github.com/lib/pq"
)

type ErrorType string

var (
	ErrTypeUniqueViolation ErrorType = "23505"
)

type Error struct {
	Type    ErrorType
	Message string
}

func ParseError(err error) error {
	if err == nil {
		return nil
	}

	dbErr := new(Error)

	if err, ok := err.(*pq.Error); ok {
		dbErr.Type = ErrorType(err.Code)
		dbErr.Message = err.Message
		return err
	}

	dbErr.Type = "unknown"
	dbErr.Message = "unknown"
	return err
}

func (err *Error) Error() string {
	return "database: " + err.Message
}
