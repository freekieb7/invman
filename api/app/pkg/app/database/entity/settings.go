package entity

import (
	"time"
)

type Settings struct {
	ModuleInspectionsActive bool
	ItemsGlobalCustomFields GlobalCustomFields
	UpdatedAt               *time.Time
}
