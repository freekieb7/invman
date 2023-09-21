package entity

import (
	"invman/api/pkg/gqlgen/model"
	"strconv"

	"github.com/google/uuid"
)

type CustomField struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Type  string    `json:"type"`
	Value string    `json:"value"`
}

type CustomFieldValue struct {
	ID    uuid.UUID `json:"id"`
	Value string    `json:"value"`
}

func (field *CustomField) IsValid() bool {
	// Value length validation
	MAX_LENGTH := 100

	if len(field.Value) > MAX_LENGTH {
		return false
	}

	// Type validation
	if !model.CustomFieldType(field.Type).IsValid() {
		return false
	}

	// Type - value match validation
	switch field.Type {
	case model.CustomFieldTypeString.String():
		{
			// Cannot go wrong
		}
	case model.CustomFieldTypeInteger.String():
		{
			if _, err := strconv.Atoi(field.Value); err != nil {
				return false
			}
		}
	case model.CustomFieldTypeFloat.String():
		{
			if _, err := strconv.ParseFloat(field.Value, 10); err != nil {
				return false
			}
		}
	default:
		{
			return false
		}
	}

	return true
}
