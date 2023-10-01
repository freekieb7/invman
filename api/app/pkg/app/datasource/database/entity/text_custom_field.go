package entity

const (
	TextCustomFieldType CustomFieldType = "TextCustomField"
)

type TextCustomField struct {
	CustomField
	TextCustomFieldValue
	OnEmptyValue *string `json:"onEmptyValue"`
}

type TextCustomFieldValue struct {
	Value *string `json:"value"`
}

type textCustomFieldFactory struct{}

type TextCustomFieldFactory interface {
	New() TextCustomField
}

func NewTextCustomFieldFactory() TextCustomFieldFactory {
	return &textCustomFieldFactory{}
}

func (factory *textCustomFieldFactory) New() TextCustomField {
	var customField TextCustomField
	customField.CustomField.Type = TextCustomFieldType

	return customField
}
