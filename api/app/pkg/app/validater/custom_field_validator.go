package validater

import "invman/api/pkg/app/database/entity"

type customFieldValidater struct{}

type CustomFieldValidater interface {
	IsValid(field entity.CustomField) bool
}

func NewCustomFieldValidater() CustomFieldValidater {
	return &customFieldValidater{}
}

func (validater *customFieldValidater) IsValid(field entity.CustomField) bool {
	if field.ID == "" {
		return false
	}

	if field.Translations.Default == "" {
		return false
	}

	// Type validation happens in specific field validers

	return true
}
