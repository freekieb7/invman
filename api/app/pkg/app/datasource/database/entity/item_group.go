package entity

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"invman/api/pkg/gqlgen/model"
	"time"

	"github.com/google/uuid"
)

type ItemGroup struct {
	ID         uuid.UUID
	Name       string
	Attributes ItemGroupAttributes
	CreatedAt  time.Time
	UpdatedAt  *time.Time
	DeletedAt  *time.Time
}

type ItemGroupAttributes struct {
	Specific ItemAttributeSpecific `json:"specific"`
}

type ItemGroupAttributeSpecific struct {
	Fields []CustomField `json:"fields"`
}

func (a ItemGroupAttributes) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *ItemGroupAttributes) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(b, &a)
}

func (itemGroup *ItemGroup) Model() *model.ItemGroup {
	if itemGroup == nil {
		return nil
	}

	return &model.ItemGroup{
		ID:        itemGroup.ID,
		Name:      itemGroup.Name,
		CreatedAt: itemGroup.CreatedAt,
		UpdatedAt: itemGroup.UpdatedAt,
		Attributes: func(attributes ItemGroupAttributes) *model.ItemGroupAttributes {
			var modelAttributeFields []model.CustomField

			for _, field := range attributes.Specific.Fields {
				modelAttributeFields = append(modelAttributeFields, model.CustomField{
					ID:    field.ID,
					Name:  field.Name,
					Type:  model.CustomFieldType(field.Type),
					Value: field.Value,
				})
			}

			return &model.ItemGroupAttributes{
				Specific: &model.ItemGroupAttributeSpecific{
					Fields: modelAttributeFields,
				},
			}
		}(itemGroup.Attributes),
	}
}
