package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type FieldTranslation struct {
	Default string  `json:"default"`
	EN      *string `json:"en"`
	NL      *string `json:"nl"`
}

type LocalField struct {
	ID          string           `json:"id"`
	Translation FieldTranslation `json:"translation"`
	Type        string           `json:"type"`
	Value       *string          `json:"value"`
}

type GlobalField struct {
	ID          string           `json:"id"`
	Translation FieldTranslation `json:"translation"`
	Type        string           `json:"type"`
	Enabled     bool             `json:"enabled"`
}

type GlobalFieldValue struct {
	FieldID string  `json:"id"`
	Value   *string `json:"value"`
}

type LocalFields struct {
	V []LocalField `json:"fields"`
}

type GlobalFields struct {
	V []GlobalField `json:"fields"`
}

type GlobalFieldValues struct {
	V []GlobalFieldValue `json:"values"`
}

func (fields LocalFields) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields GlobalFields) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields GlobalFieldValues) Value() (driver.Value, error) {
	return json.Marshal(fields)
}

func (fields *LocalFields) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fields)
}

func (fields *GlobalFields) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fields)
}

func (fields *GlobalFieldValues) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &fields)
}

// func (field *CustomFieldWithValue) IsValid() bool {
// 	// Value length validation
// 	MAX_LENGTH := 100

// 	// Type validation
// 	if !gql.CustomFieldType(field.Type).IsValid() {
// 		return false
// 	}

// 	// Value validation
// 	switch gql.CustomFieldType(field.Type) {
// 	case gql.CustomFieldTypeString:
// 		{
// 			if field.Value == nil {
// 				break
// 			}

// 			if len(*field.Value) > MAX_LENGTH {
// 				return false
// 			}
// 		}
// 	case gql.CustomFieldTypeInteger:
// 		{
// 			if field.Value == nil {
// 				break
// 			}

// 			if len(*field.Value) > MAX_LENGTH {
// 				return false
// 			}

// 			if _, err := strconv.Atoi(*field.Value); err != nil {
// 				return false
// 			}
// 		}
// 	case gql.CustomFieldTypeFloat:
// 		{
// 			if field.Value == nil {
// 				break
// 			}

// 			if len(*field.Value) > MAX_LENGTH {
// 				return false
// 			}

// 			if _, err := strconv.ParseFloat(*field.Value, 10); err != nil {
// 				return false
// 			}
// 		}
// 	default:
// 		{
// 			return false
// 		}
// 	}

// 	return true
// }
