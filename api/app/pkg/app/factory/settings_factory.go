package factory

import "invman/api/pkg/app/database/entity"

type settingsFactory struct{}

type SettingsFactory interface {
	New() entity.Settings
}

func NewSettingsFactory() SettingsFactory {
	return &settingsFactory{}
}

func (factory *settingsFactory) New() entity.Settings {
	return entity.Settings{
		ItemsCustomFields: entity.CustomFields{
			V: make(map[string]interface{}),
		},
	}
}
