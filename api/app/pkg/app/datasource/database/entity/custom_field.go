package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	gql "invman/api/pkg/gqlgen/model"
	"strconv"
)

type CustomField struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Type    string `json:"type"`
	Enabled bool   `json:"enabled"`
}

type CustomFieldWithValue struct {
	CustomField
	Value *string `json:"value"`
}

type CustomFieldValueOnly struct {
	ID    string  `json:"id"`
	Value *string `json:"value"`
}

type CustomFields struct {
	V []CustomField `json:"fields"`
}

type CustomFieldsWithValue struct {
	V []CustomFieldWithValue `json:"fields"`
}

type CustomFieldsValueOnly struct {
	V []CustomFieldValueOnly `json:"fields"`
}

func (field *CustomFieldWithValue) IsValid() bool {
	// Value length validation
	MAX_LENGTH := 100

	// Type validation
	if !gql.CustomFieldType(field.Type).IsValid() {
		return false
	}

	// Value validation
	switch gql.CustomFieldType(field.Type) {
	case gql.CustomFieldTypeString:
		{
			if field.Value == nil {
				break
			}

			if len(*field.Value) > MAX_LENGTH {
				return false
			}
		}
	case gql.CustomFieldTypeInteger:
		{
			if field.Value == nil {
				break
			}

			if len(*field.Value) > MAX_LENGTH {
				return false
			}

			if _, err := strconv.Atoi(*field.Value); err != nil {
				return false
			}
		}
	case gql.CustomFieldTypeFloat:
		{
			if field.Value == nil {
				break
			}

			if len(*field.Value) > MAX_LENGTH {
				return false
			}

			if _, err := strconv.ParseFloat(*field.Value, 10); err != nil {
				return false
			}
		}
	default:
		{
			return false
		}
	}

	return true
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

	return json.Unmarshal(valueBytes, &fields)
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

	return json.Unmarshal(valueBytes, &fields)
}

func (fields CustomFieldsValueOnly) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *CustomFieldsValueOnly) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fields)
}
