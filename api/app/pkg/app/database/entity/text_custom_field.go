package entity

type GlobalTextCustomField struct {
	CustomField
	OnEmptyValue *string `json:"onEmptyValue"`
}

type LocalTextCustomField struct {
	CustomField
	Value        *string `json:"value"`
	OnEmptyValue *string `json:"onEmptyValue"`
}

type GlobalTextCustomFieldValue struct {
	Value *string `json:"value"`
}
