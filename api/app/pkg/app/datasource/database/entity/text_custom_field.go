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
