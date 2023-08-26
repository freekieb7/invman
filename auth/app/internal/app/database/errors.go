package database

import (
	"github.com/lib/pq"
)

var (
	ErrCodeUniqueViolation = "23505"
)

type DbError interface {
	Code() string
	Message() string
	Error() string
}

type pgError struct {
	code    string
	message string
}

func (r *pgError) Code() string {
	return r.code
}

func (r *pgError) Message() string {
	return r.message
}

func (r *pgError) Error() string {
	return "postgres error: %s"
}

// Transforms pg sql error to db error
func Wrap(err error) DbError {
	if err == nil {
		return nil
	}

	if err, ok := err.(*pq.Error); ok {
		return &pgError{
			code:    string(err.Code),
			message: err.Message,
		}
	}

	return &pgError{
		code:    "unknown",
		message: "unknown db error occurred",
	}
}
