package validater

import "invman/api/pkg/app/database/entity"

type textCustomFieldValidater struct {
	customFieldValidater CustomFieldValidater
}

type TextCustomFieldValidater interface {
	IsValid(field entity.TextCustomField) bool
}

func NewTextCustomFieldValidater(customFieldValidater CustomFieldValidater) TextCustomFieldValidater {
	return &textCustomFieldValidater{
		customFieldValidater: customFieldValidater,
	}
}

func (validater *textCustomFieldValidater) IsValid(field entity.TextCustomField) bool {
	if !validater.customFieldValidater.IsValid(field.CustomField) {
		return false
	}

	if field.CustomField.Type != entity.TextCustomFieldType {
		return false
	}

	return true
}
