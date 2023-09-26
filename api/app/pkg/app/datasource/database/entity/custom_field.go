package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	gql "invman/api/pkg/gqlgen/model"
	"strconv"
)

type CustomField struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Type  string `json:"type"`
	Value string `json:"value"`
}

type CustomFields struct {
	Values []CustomField `json:"fields"`
}

func (field *CustomField) IsValid() bool {
	// Value length validation
	MAX_LENGTH := 100

	if len(field.Value) > MAX_LENGTH {
		return false
	}

	// Type validation
	if !gql.CustomFieldType(field.Type).IsValid() {
		return false
	}

	// Value validation
	switch gql.CustomFieldType(field.Type) {
	case gql.CustomFieldTypeString:
		{
			// OK
		}
	case gql.CustomFieldTypeInteger:
		{
			if _, err := strconv.Atoi(field.Value); err != nil {
				return false
			}
		}
	case gql.CustomFieldTypeFloat:
		{
			if _, err := strconv.ParseFloat(field.Value, 10); err != nil {
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
	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fields)
}
