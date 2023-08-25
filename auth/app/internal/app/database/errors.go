package database

import (
	"github.com/lib/pq"
)

var (
	ErrCodeUniqueViolation = "23505"
)

type DbError struct {
	Code    string
	Message string
}

func (r *DbError) Error() string {
	return "db error: %s"
}

// Transforms pg sql error to db error
func Wrap(err error) *DbError {
	if err == nil {
		return nil
	}

	if err, ok := err.(*pq.Error); ok {
		return &DbError{
			Code:    string(err.Code),
			Message: err.Message,
		}
	}

	return &DbError{
		Code:    "unknown",
		Message: "unknown db error occurred",
	}
}
