package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.37

import (
	"context"
	"fmt"
	"invman/api/pkg/app/datasource/database/entity"
	"invman/api/pkg/gqlgen/model"

	"github.com/google/uuid"
)

// CreateItemGroup is the resolver for the createItemGroup field.
func (r *mutationResolver) CreateItemGroup(ctx context.Context, input model.CreateItemGroupInput) (*model.ItemGroup, error) {
	newItemGroup := entity.ItemGroup{
		ID:   uuid.New(),
		Name: input.Name,
		Attributes: func(input *model.ItemGroupAttributesInput) entity.ItemGroupAttributes {
			var attributes entity.ItemGroupAttributes

			if input == nil {
				return attributes
			}

			// Add fields to attributes
			for _, field := range input.Specific.Fields {
				attributes.Specific.Fields = append(attributes.Specific.Fields, entity.CustomField{
					ID:    uuid.New(),
					Name:  field.Name,
					Type:  field.Type,
					Value: field.Value,
				})
			}

			return attributes
		}(input.Attributes),
	}

	err := r.ItemGroupRepository.Create(newItemGroup)

	if err != nil {
		return nil, err
	}

	itemGroup, err := r.ItemGroupRepository.Get(newItemGroup.ID)

	if err != nil {
		return nil, err
	}

	return &model.ItemGroup{
		ID:        itemGroup.ID,
		Name:      itemGroup.Name,
		CreatedAt: itemGroup.CreatedAt,
		UpdatedAt: itemGroup.UpdatedAt,
		Attributes: func(entityAttributes entity.ItemGroupAttributes) *model.ItemGroupAttributes {
			var modelFields []model.CustomField

			for _, field := range entityAttributes.Specific.Fields {
				modelFields = append(modelFields, model.CustomField{
					ID:    field.ID,
					Name:  field.Name,
					Type:  model.CustomFieldType(field.Type),
					Value: field.Value,
				})
			}

			return &model.ItemGroupAttributes{
				Specific: &model.ItemGroupAttributeSpecific{
					Fields: modelFields,
				},
			}
		}(itemGroup.Attributes),
	}, nil
}

// DeleteItemGroup is the resolver for the deleteItemGroup field.
func (r *mutationResolver) DeleteItemGroup(ctx context.Context, id uuid.UUID) (bool, error) {
	panic(fmt.Errorf("not implemented: DeleteItemGroup - deleteItemGroup"))
}

// ItemGroup is the resolver for the itemGroup field.
func (r *queryResolver) ItemGroup(ctx context.Context, id uuid.UUID) (*model.ItemGroup, error) {
	panic(fmt.Errorf("not implemented: ItemGroup - itemGroup"))
}

// ItemGroups is the resolver for the itemGroups field.
func (r *queryResolver) ItemGroups(ctx context.Context, limit *int, offset *int) ([]model.ItemGroup, error) {
	panic(fmt.Errorf("not implemented: ItemGroups - itemGroups"))
}
