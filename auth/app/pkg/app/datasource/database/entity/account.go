package entity

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	ID        uuid.UUID
	CompanyID uuid.UUID
	Email     string
	Password  string
	Firstname string
	Lastname  string
	CreatedAt time.Time
	UpdatedAt *time.Time
	DeletedAt *time.Time
}
