package entity

import (
	"time"

	"github.com/google/uuid"
)

type Account struct {
	UUID      uuid.UUID
	Email     string
	Username  string
	Password  string
	Verified  bool
	CreatedAt time.Time
	UpdatedAt *time.Time
	DeletedAt *time.Time
}
