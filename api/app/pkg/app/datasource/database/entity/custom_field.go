package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"log"
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

type CustomFieldsValues struct {
	V map[string]interface{} `json:"fields_values"`
}

type CustomFieldsWithValue struct {
	V map[string]interface{} `json:"fields_with_value"`
}

func (fields CustomFields) Combine(fieldsValues CustomFieldsValues) CustomFieldsWithValue {
	customFieldsWithValue := CustomFieldsWithValue{
		V: make(map[string]interface{}),
	}

	for fieldId, field := range fields.V {
		switch field.(type) {
		case *TextCustomField:
			{
				field, ok := field.(*TextCustomField)

				if !ok {
					log.Print("TODO")
					continue
				}

				var value *string

				fieldValue, ok := fieldsValues.V[fieldId].(*TextCustomFieldValue)

				if ok {
					value = fieldValue.Value
				}

				customFieldsWithValue.V[field.ID] = TextCustomFieldWithValue{
					TextCustomField: *field,
					Value:           value,
				}
			}
		default:
			log.Printf("unexpected type %T", field)
		}
	}

	return customFieldsWithValue
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
