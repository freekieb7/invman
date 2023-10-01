package entity

import (
	"time"

	"github.com/google/uuid"
)

type ItemGroup struct {
	ID        uuid.UUID
	Name      string
	CreatedAt time.Time
	UpdatedAt *time.Time
	DeletedAt *time.Time
}
