package entity

import (
	gql "invman/api/pkg/gqlgen/model"
	"time"
)

type Settings struct {
	ModuleInspectionsActive bool
	ItemsCustomFields       CustomFields
	UpdatedAt               *time.Time
}

func (settings *Settings) CopyTo(target *gql.Settings) {
	if target == nil {
		return
	}

	target.ModuleInspectionsActive = settings.ModuleInspectionsActive

	// for _, field := range settings.GlobalFields.V {
	// 	target.GlobalFields = append(target.GlobalFields, gql.GlobalField{
	// 		ID:   field.ID,
	// 		Name: field.Translation.Default, // TODO by locale
	// 		Type: gql.GlobalFieldType(field.Type),
	// 	})
	// }
}
