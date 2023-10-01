package entity

import (
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID                       uuid.UUID
	PID                      string
	GroupID                  *uuid.UUID
	LocalCustomFields        LocalCustomFields
	GlobalCustomFieldsValues GlobalCustomFieldsValues
	CreatedAt                time.Time
	UpdatedAt                *time.Time
	DeletedAt                *time.Time
}
