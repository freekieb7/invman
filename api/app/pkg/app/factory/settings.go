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
		ItemsGlobalCustomFields: entity.GlobalCustomFields{
			V: make(map[string]interface{}),
		},
	}
}
