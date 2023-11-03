package factory

import (
	"fmt"
	"invman/api/pkg/app/database/entity"
	gql "invman/api/pkg/gqlgen/model"

	"github.com/google/uuid"
)

type abstractCustomFieldFactory struct {
	textCustomFieldFactory TextCustomFieldFactory
}

type AbstractCustomFieldFactory interface {
	ToLocalCustomFields(customFields []*gql.CustomFieldsWithValueInput) map[string]interface{}
	CombineToGqlCustomFields(fields map[string]interface{}, values entity.GlobalCustomFieldsValues) ([]gql.CustomFieldUnion, error)
	ConvertToGlobalCustomFieldsValues(fields map[string]interface{}, values []*gql.CustomFieldsValuesInput) (map[string]interface{}, error)
	ConvertToGqlCustomFields(fields map[string]interface{}) ([]gql.CustomFieldUnion, error)
}

func NewAbstractCustomFieldConverter(textCustomFieldFactory TextCustomFieldFactory) AbstractCustomFieldFactory {
	return &abstractCustomFieldFactory{
		textCustomFieldFactory: textCustomFieldFactory,
	}
}

func (converter *abstractCustomFieldFactory) ToLocalCustomFields(customFields []*gql.CustomFieldsWithValueInput) map[string]interface{} {
	localFields := make(map[string]interface{})

	for _, dynamicLocalCustomField := range customFields {
		fieldId := uuid.NewString()

		if dynamicLocalCustomField.TextCustomField != nil {
			customField := dynamicLocalCustomField.TextCustomField

			textCustomField := converter.textCustomFieldFactory.NewLocal()
			textCustomField.CustomField.ID = fieldId
			textCustomField.CustomField.Translations.Default = customField.Field.Name
			textCustomField.OnEmptyValue = customField.OnEmptyValue
			textCustomField.Value = customField.Value

			localFields[fieldId] = textCustomField
		}
	}

	return localFields
}

func (converter *abstractCustomFieldFactory) CombineToGqlCustomFields(globalFields map[string]interface{}, globalValues entity.GlobalCustomFieldsValues) ([]gql.CustomFieldUnion, error) {
	var gqlFields []gql.CustomFieldUnion

	for _, globalField := range globalFields {
		if globalField, ok := globalField.(*entity.GlobalTextCustomField); ok {
			textCustomField := gql.TextCustomField{
				Field: &gql.CustomField{
					ID:   globalField.ID,
					Name: globalField.Translations.Default,
				},
				OnEmptyValue: globalField.OnEmptyValue,
			}

			if value, ok := globalValues.V[globalField.ID]; ok {
				if text, ok := value.(string); ok {
					textCustomField.Value = &text
				}
			}

			gqlFields = append(gqlFields, textCustomField)
			continue
		}

		return nil, fmt.Errorf("custom field conversion: Unsupported type encountered %T", globalField)
	}

	return gqlFields, nil
}

func (converter *abstractCustomFieldFactory) ConvertToGlobalCustomFieldsValues(fields map[string]interface{}, values []*gql.CustomFieldsValuesInput) (map[string]interface{}, error) {
	customFieldValues := make(map[string]interface{})

	for _, globalCustomFieldValue := range values {
		if globalCustomFieldValue.TextCustomField != nil {
			customFieldValue := globalCustomFieldValue.TextCustomField

			if fields[customFieldValue.ID] != nil {
				customFieldValues[customFieldValue.ID] = customFieldValue.Value
			}
		}
	}

	return customFieldValues, nil
}

func (converter *abstractCustomFieldFactory) ConvertToGqlCustomFields(localFields map[string]interface{}) ([]gql.CustomFieldUnion, error) {
	var gqlFields []gql.CustomFieldUnion

	for _, localField := range localFields {
		if localField, ok := localField.(*entity.LocalTextCustomField); ok {
			textCustomField := gql.TextCustomField{
				Field: &gql.CustomField{
					ID:   localField.ID,
					Name: localField.Translations.Default,
				},
				OnEmptyValue: localField.OnEmptyValue,
				Value:        localField.Value,
			}

			gqlFields = append(gqlFields, textCustomField)
			continue
		}

		return nil, fmt.Errorf("custom field conversion: Unsupported type encountered %T", localField)
	}

	return gqlFields, nil
}

func (converter *abstractCustomFieldFactory) ConvertToGqlGlobalCustomFields(globalCustomFields map[string]interface{}) ([]gql.CustomField, error) {
	var gqlFields []gql.CustomField

	for _, globalCustomField := range globalCustomFields {
		if field, ok := globalCustomField.(*entity.CustomField); ok {
			gqlFields = append(gqlFields, gql.CustomField{
				ID:   field.ID,
				Name: field.Translations.Default,
			})
			continue
		}

		return nil, fmt.Errorf("custom field conversion: Unsupported type encountered %T", globalCustomField)
	}

	return gqlFields, nil
}
