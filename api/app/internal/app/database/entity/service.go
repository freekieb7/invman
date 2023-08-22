package entity

import (
	"time"

	"github.com/google/uuid"
)

type Service struct {
	UUID      uuid.UUID `json:"uuid"`
	CID       uuid.UUID `json:"gid"`
	CreatedBy uuid.UUID `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt time.Time `json:"deleted_at"`
}
