package entity

import (
	gql "invman/api/pkg/gqlgen/model"
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID          uuid.UUID
	PID         string
	GroupID     *uuid.UUID
	LocalFields CustomFields
	CreatedAt   time.Time
	UpdatedAt   *time.Time
	DeletedAt   *time.Time
}

func (item Item) IsValid() bool {
	for _, field := range item.LocalFields.Values {
		if !field.IsValid() {
			return false
		}
	}

	return true
}

func (item *Item) Scan(target *gql.Item) {
	if target == nil {
		return
	}

	target.ID = item.ID
	target.Pid = item.PID
	target.CreatedAt = item.CreatedAt
	target.UpdatedAt = item.UpdatedAt

	for _, field := range item.LocalFields.Values {
		target.LocalFields = append(target.LocalFields, gql.CustomField{
			ID:    field.ID,
			Name:  field.Name,
			Type:  gql.CustomFieldType(field.Type),
			Value: field.Value,
		})
	}
}
