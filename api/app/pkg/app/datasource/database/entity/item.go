package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"invman/api/pkg/gqlgen/model"
	"time"

	"github.com/google/uuid"
)

type Item struct {
	ID         uuid.UUID
	GroupID    *uuid.UUID
	Attributes ItemAttributes
	CreatedAt  time.Time
	UpdatedAt  *time.Time
	DeletedAt  *time.Time
}

func (item Item) IsValid() bool {
	for _, field := range item.Attributes.Specific.Fields {
		if !field.IsValid() {
			return false
		}
	}

	return true
}

type ItemAttributes struct {
	Specific ItemAttributeSpecific `json:"specific"`
	General  ItemAttributeGeneral  `json:"general"`
}

type ItemAttributeSpecific struct {
	Fields []CustomField `json:"fields"`
}

type ItemAttributeGeneral struct {
	Fields []CustomField `json:"fields"`
}

func (attributes ItemAttributes) Value() (driver.Value, error) {
	return json.Marshal(attributes)
}

func (attributes *ItemAttributes) Scan(value interface{}) error {
	valueBytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(valueBytes, &attributes)
}

func (item *Item) Model(itemGroup *ItemGroup) *model.Item {
	var modelItemGroup *model.ItemGroup

	if itemGroup != nil {
		modelItemGroup = itemGroup.Model()
	}

	return &model.Item{
		ID:        item.ID,
		Group:     modelItemGroup,
		CreatedAt: item.CreatedAt,
		UpdatedAt: item.UpdatedAt,
		Attributes: func(attributes ItemAttributes) *model.ItemAttributes {
			var modelAttributeFields []model.CustomField

			for _, field := range attributes.Specific.Fields {
				modelAttributeFields = append(modelAttributeFields, model.CustomField{
					ID:    field.ID,
					Name:  field.Name,
					Type:  model.CustomFieldType(field.Type),
					Value: field.Value,
				})
			}

			return &model.ItemAttributes{
				Specific: &model.ItemAttributeSpecific{
					Fields: modelAttributeFields,
				},
			}
		}(item.Attributes),
	}
}
