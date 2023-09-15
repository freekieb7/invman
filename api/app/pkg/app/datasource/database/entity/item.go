package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID         uuid.UUID
	GroupID    *uuid.UUID
	Attributes ItemAttributes
	CreatedAt  time.Time
	UpdatedAt  *time.Time
	DeletedAt  *time.Time
}

type ItemAttributes struct {
	Fields []ItemAttributeField `json:"fields,omitempty"`
}

type ItemAttributeField struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Type  string    `json:"type"`
	Value string    `json:"value"`
}

func (a ItemAttributes) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *ItemAttributes) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(b, &a)
}
