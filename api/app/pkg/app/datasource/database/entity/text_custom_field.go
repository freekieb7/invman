package entity

type TextCustomField struct {
	CustomField
	OnEmptyValue *string `json:"onEmptyValue"`
}

type TextCustomFieldWithValue struct { // Meant for local fields
	TextCustomField
	Value *string `json:"value"`
}

type TextCustomFieldValue struct {
	TextCustomFieldID string  `json:"id"`
	Value             *string `json:"value"`
}
