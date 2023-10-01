package entity

import (
	"time"
)

type Settings struct {
	ModuleInspectionsActive bool
	ItemsCustomFields       CustomFields
	UpdatedAt               *time.Time
}
