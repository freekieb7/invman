package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type Translations struct {
	Default string `json:"default"`
	// EN      *string `json:"en"`
	// NL      *string `json:"nl"`
}

type CustomField struct {
	ID           string       `json:"id"`
	Translations Translations `json:"translations"`
	Type         string       `json:"type"`
}

type CustomFields struct {
	V []interface{} `json:"fields"`
}

type CustomFieldsValues struct {
	V []interface{} `json:"fields_values"`
}

type CustomFieldsWithValue struct {
	V []interface{} `json:"fields_with_value"`
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
		jsonData, _ := json.Marshal(field)

		var textCustomField *TextCustomField
		if err := json.Unmarshal(jsonData, &textCustomField); err == nil {
			fields.V[index] = textCustomField
		}
	}

	return nil
}

func (fields CustomFieldsValues) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fieldValues *CustomFieldsValues) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	if err := json.Unmarshal(valueBytes, &fieldValues); err != nil {
		return err
	}

	for index, fieldValue := range fieldValues.V {
		jsonData, _ := json.Marshal(fieldValue)

		var textCustomFieldValue *TextCustomFieldValue
		if err := json.Unmarshal(jsonData, &textCustomFieldValue); err == nil {
			fieldValues.V[index] = textCustomFieldValue
		}
	}

	return nil
}

func (fields CustomFieldsWithValue) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *CustomFieldsWithValue) Scan(value interface{}) error {
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
		jsonData, _ := json.Marshal(field)

		var textCustomFieldWithValue *TextCustomFieldWithValue
		if err := json.Unmarshal(jsonData, &textCustomFieldWithValue); err == nil {
			fields.V[index] = textCustomFieldWithValue
		}
	}

	return nil
}
