package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type CustomFieldType string

type Translations struct {
	Default string `json:"default"`
	// EN      *string `json:"en"`
	// NL      *string `json:"nl"`
}

type CustomField struct {
	ID           string          `json:"id"`
	Translations Translations    `json:"translations"`
	Type         CustomFieldType `json:"type"`
}

type CustomFields struct {
	V map[string]interface{} `json:"fields"`
}

type GlobalCustomFieldsValues struct {
	V map[string]interface{} `json:"global_fields_values"`
}

func (fields CustomFields) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *CustomFields) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	if err := json.Unmarshal(valueBytes, &fields); err != nil {
		return err
	}

	for index, field := range fields.V {
		fieldAsMap, ok := field.(map[string]interface{})

		if !ok {
			return errors.New("type assertion to map[string]interface failed")
		}

		fieldType, ok := fieldAsMap["type"].(string)

		if !ok {
			return errors.New("type assertion to map[string]interface failed")
		}

		fieldAsJson, _ := json.Marshal(field)

		switch CustomFieldType(fieldType) {
		case TextCustomFieldType:
			{
				var field *TextCustomField

				if err := json.Unmarshal(fieldAsJson, &field); err != nil {
					return errors.New("type conversion to TextCustomField failed")
				}

				fields.V[index] = field
			}
		}
	}

	return nil
}

func (fields GlobalCustomFieldsValues) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fieldValues *GlobalCustomFieldsValues) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fieldValues)
}
