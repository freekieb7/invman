package entity

import (
	"time"
)

type Settings struct {
	ModuleInspectionsActive bool
	ItemsCustomFields       CustomFields
	UpdatedAt               *time.Time
}

type settingsFactory struct{}

type SettingsFactory interface {
	New() Settings
}

func NewSettingsFactory() SettingsFactory {
	return &settingsFactory{}
}

func (factory *settingsFactory) New() Settings {
	return Settings{
		ItemsCustomFields: CustomFields{
			V: make(map[string]interface{}),
		},
	}
}
