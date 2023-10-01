package validater

import (
	"invman/api/pkg/app/database/entity"

	"github.com/google/uuid"
)

type itemValidater struct{}

type ItemValidater interface {
	IsValid(item entity.Item) bool
}

func NewItemValidater() ItemValidater {
	return &itemValidater{}
}

func (validater *itemValidater) IsValid(item entity.Item) bool {
	if item.ID == uuid.Nil {
		return false
	}

	if item.PID == "" {
		return false
	}

	if item.LocalCustomFields.V == nil {
		return false
	}

	if item.GlobalCustomFieldsValues.V == nil {
		return false
	}

	return true
}
