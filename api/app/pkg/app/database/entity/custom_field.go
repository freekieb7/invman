package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type CustomFieldType string

const (
	TextCustomFieldType CustomFieldType = "TextCustomField"
)

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

type LocalCustomFields struct {
	V map[string]interface{} `json:"fields"`
}

type GlobalCustomFields struct {
	V map[string]interface{} `json:"fields"`
}

type GlobalCustomFieldsValues struct {
	V map[string]interface{} `json:"global_fields_values"`
}

func (fields LocalCustomFields) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *LocalCustomFields) Scan(value interface{}) error {
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
				var field *LocalTextCustomField

				if err := json.Unmarshal(fieldAsJson, &field); err != nil {
					return errors.New("type conversion to LocalTextCustomField failed")
				}

				fields.V[index] = field
			}
		}
	}

	return nil
}

func (fields GlobalCustomFields) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *GlobalCustomFields) Scan(value interface{}) error {
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
			return errors.New("sql scan: field type does not exist")
		}

		fieldAsJson, _ := json.Marshal(field)

		switch CustomFieldType(fieldType) {
		case TextCustomFieldType:
			{
				var field *GlobalTextCustomField

				if err := json.Unmarshal(fieldAsJson, &field); err != nil {
					return errors.New("type conversion to GlobalTextCustomField failed")
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
