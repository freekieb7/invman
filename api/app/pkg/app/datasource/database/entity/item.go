package entity

import (
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID                       uuid.UUID
	PID                      string
	GroupID                  *uuid.UUID
	LocalCustomFields        CustomFields
	GlobalCustomFieldsValues GlobalCustomFieldsValues
	CreatedAt                time.Time
	UpdatedAt                *time.Time
	DeletedAt                *time.Time
}

type itemFactory struct{}

type ItemFactory interface {
	New() Item
}

func NewItemFactory() ItemFactory {
	return &itemFactory{}
}

func (factory *itemFactory) New() Item {
	return Item{
		LocalCustomFields: CustomFields{
			V: make(map[string]interface{}),
		},
		GlobalCustomFieldsValues: GlobalCustomFieldsValues{
			V: make(map[string]interface{}),
		},
	}
}
