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

func ParseError(poolErr error) error {

	if poolErr == nil {
		return nil
	}

	err := new(Error)

	if poolErr, ok := poolErr.(*pq.Error); ok {
		err.Type = ErrorType(poolErr.Code)
		err.Message = poolErr.Message
		return err
	}

	err.Type = "unknown"
	err.Message = "unknown"
	return err
}

func (err *Error) Error() string {
	return "database: " + err.Message
}
