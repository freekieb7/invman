package entity

import (
	gql "invman/api/pkg/gqlgen/model"
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID                uuid.UUID
	PID               string
	GroupID           *uuid.UUID
	LocalFields       CustomFieldsWithValue
	GlobalFieldValues CustomFieldsValueOnly
	CreatedAt         time.Time
	UpdatedAt         *time.Time
	DeletedAt         *time.Time
}

func (item Item) IsValid() bool {
	for _, field := range item.LocalFields.V {
		if !field.IsValid() {
			return false
		}
	}

	return true
}

func (item *Item) CopyTo(target *gql.Item) {
	if target == nil {
		return
	}

	target.ID = item.ID
	target.Pid = item.PID
	target.CreatedAt = item.CreatedAt
	target.UpdatedAt = item.UpdatedAt

	for _, field := range item.LocalFields.V {
		target.LocalFields = append(target.LocalFields, gql.CustomField{
			ID:      field.ID,
			Name:    field.Name,
			Type:    gql.CustomFieldType(field.Type),
			Enabled: field.Enabled,
			Value:   field.Value,
		})
	}
}
