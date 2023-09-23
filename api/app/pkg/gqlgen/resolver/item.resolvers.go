package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.37

import (
	"context"
	"errors"
	"fmt"
	"invman/api/pkg/app/datasource/database/entity"
	"invman/api/pkg/gqlgen/generated"
	"invman/api/pkg/gqlgen/model"

	"github.com/google/uuid"
)

// CreateItem is the resolver for the createItem field.
func (r *mutationResolver) CreateItem(ctx context.Context, input model.CreateItemInput) (*model.Item, error) {
	newItem := entity.Item{
		ID:      uuid.New(),
		GroupID: input.GroupID,
		Attributes: func(input *model.ItemAttributesInput) entity.ItemAttributes {
			var attributes entity.ItemAttributes

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

	if !newItem.IsValid() {
		return nil, errors.New("validation: Item did not meet validation requirements")
	}

	err := r.ItemRepository.Create(newItem)

	if err != nil {
		return nil, err
	}

	item, err := r.ItemRepository.Get(newItem.ID)

	if err != nil {
		return nil, err
	}

	var itemGroup *entity.ItemGroup

	if item.GroupID != nil {
		group, err := r.ItemGroupRepository.Get(*item.GroupID)

		if err != nil {
			return nil, err
		}

		itemGroup = &group
	}

	if err != nil {
		return nil, err
	}

	return item.Model(itemGroup), nil
}

// DeleteItem is the resolver for the deleteItem field.
func (r *mutationResolver) DeleteItem(ctx context.Context, id uuid.UUID) (bool, error) {
	err := r.ItemRepository.Delete(id)

	if err != nil {
		return false, err
	}

	return true, nil
}

// Item is the resolver for the item field.
func (r *queryResolver) Item(ctx context.Context, id uuid.UUID) (*model.Item, error) {
	// STEP 1: Get item
	item, err := r.ItemRepository.Get(id)

	if err != nil {
		return nil, err
	}

	// STEP 2: Return obtained item
	modelItem := item.Model(nil)

	if item.GroupID != nil {
		itemGroup, err := r.ItemGroupRepository.Get(*item.GroupID)

		if err != nil {
			return nil, err
		}

		modelItem.Group = itemGroup.Model()
	}

	return modelItem, nil
}

// Items is the resolver for the items field.
func (r *queryResolver) Items(ctx context.Context, limit int, offset *int, filters []model.ItemsFilter) ([]model.Item, error) {
	// STEP 1: Validate input
	MAX_LIMIT := 100
	if limit > MAX_LIMIT {
		return nil, fmt.Errorf("validation: limit may not exceed %d", MAX_LIMIT)
	}

	// STEP 2: Find items
	items, err := r.ItemRepository.List(limit, offset, filters)

	if err != nil {
		return nil, err
	}

	// STEP 3: Return found items
	var modelItems []model.Item

	for _, item := range items {
		modelItem := item.Model(nil)

		if item.GroupID != nil {
			itemGroup, err := r.ItemGroupRepository.Get(*item.GroupID)

			if err != nil {
				return nil, err
			}

			modelItem.Group = itemGroup.Model()
		}

		modelItems = append(modelItems, *modelItem)
	}

	return modelItems, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
