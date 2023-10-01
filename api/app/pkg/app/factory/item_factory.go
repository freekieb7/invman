package factory

import "invman/api/pkg/app/database/entity"

type itemFactory struct{}

type ItemFactory interface {
	New() entity.Item
}

func NewItemFactory() ItemFactory {
	return &itemFactory{}
}

func (factory *itemFactory) New() entity.Item {
	return entity.Item{
		LocalCustomFields: entity.LocalCustomFields{
			V: make(map[string]interface{}),
		},
		GlobalCustomFieldsValues: entity.GlobalCustomFieldsValues{
			V: make(map[string]interface{}),
		},
	}
}
