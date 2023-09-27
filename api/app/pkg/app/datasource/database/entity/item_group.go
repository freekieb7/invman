package entity

import (
	gql "invman/api/pkg/gqlgen/model"
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

func (itemGroup ItemGroup) IsValid() bool {
	// for _, field := range item.CustomFields {
	// 	if !field.IsValid() {
	// 		return false
	// 	}
	// }

	return true
}

func (itemGroup *ItemGroup) CopyTo(target *gql.ItemGroup) {
	if target == nil {
		return
	}

	target.ID = itemGroup.ID
	target.Name = itemGroup.Name
	target.CreatedAt = itemGroup.CreatedAt
	target.UpdatedAt = itemGroup.UpdatedAt
}
