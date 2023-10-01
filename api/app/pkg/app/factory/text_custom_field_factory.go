package factory

import "invman/api/pkg/app/datasource/database/entity"

type textCustomFieldFactory struct{}

type TextCustomFieldFactory interface {
	New() entity.TextCustomField
}

func NewTextCustomFieldFactory() TextCustomFieldFactory {
	return &textCustomFieldFactory{}
}

func (factory *textCustomFieldFactory) New() entity.TextCustomField {
	var customField entity.TextCustomField
	customField.CustomField.Type = entity.TextCustomFieldType

	return customField
}
