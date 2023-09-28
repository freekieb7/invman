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
	LocalFields       LocalFields
	GlobalFieldValues GlobalFieldValues
	CreatedAt         time.Time
	UpdatedAt         *time.Time
	DeletedAt         *time.Time
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
		target.LocalFields = append(target.LocalFields, gql.LocalField{
			ID:    field.ID,
			Name:  field.Translation.Default, // TODO pick by locale
			Type:  gql.LocalFieldType(field.Type),
			Value: field.Value,
		})
	}
}
