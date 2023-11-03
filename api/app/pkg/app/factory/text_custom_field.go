package factory

import "invman/api/pkg/app/database/entity"

type textCustomFieldFactory struct{}

type TextCustomFieldFactory interface {
	NewGlobal() entity.GlobalTextCustomField
	NewLocal() entity.LocalTextCustomField
}

func NewTextCustomFieldFactory() TextCustomFieldFactory {
	return &textCustomFieldFactory{}
}

func (factory *textCustomFieldFactory) NewGlobal() entity.GlobalTextCustomField {
	var globalField entity.GlobalTextCustomField
	globalField.CustomField.Type = entity.TextCustomFieldType

	return globalField
}

func (factory *textCustomFieldFactory) NewLocal() entity.LocalTextCustomField {
	var localField entity.LocalTextCustomField
	localField.CustomField.Type = entity.TextCustomFieldType

	return localField
}
