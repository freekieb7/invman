package entity

import (
	gql "invman/api/pkg/gqlgen/model"
	"time"
)

type Settings struct {
	ModuleInspectionsActive bool
	GlobalFields            CustomFields
	UpdatedAt               *time.Time
}

func (settings *Settings) CopyTo(target *gql.Settings) {
	if target == nil {
		return
	}

	target.ModInspectionsActive = settings.ModuleInspectionsActive

	for _, field := range settings.GlobalFields.V {
		target.GlobalFields = append(target.GlobalFields, gql.CustomField{
			ID:      field.ID,
			Name:    field.Name,
			Type:    gql.CustomFieldType(field.Type),
			Enabled: field.Enabled,
			Value:   nil,
		})
	}
}
