package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.37

import (
	"context"
	"fmt"
	"invman/api/pkg/gqlgen/generated"
	gql "invman/api/pkg/gqlgen/model"

	"github.com/google/uuid"
)

// CreateItem is the resolver for the createItem field.
func (r *mutationResolver) CreateItem(ctx context.Context, input gql.CreateItemInput) (*gql.Item, error) {
	item := r.ItemFactory.New()

	item.ID = uuid.New()
	item.PID = input.Pid
	item.GroupID = input.GroupID

	for k, v := range r.AbstractCustomFieldFactory.ToLocalCustomFields(input.LocalCustomFields) {
		item.LocalCustomFields.V[k] = v
	}

	settings, err := r.SettingsRepository.Get()

	if err != nil {
		return nil, err
	}

	globalCustomFieldsValues, err := r.AbstractCustomFieldFactory.ConvertToGlobalCustomFieldsValues(settings.ItemsGlobalCustomFields.V, input.GlobalCustomFieldsValues)

	if err != nil {
		return nil, err
	}

	for k, v := range globalCustomFieldsValues {
		item.GlobalCustomFieldsValues.V[k] = v
	}

	if err := r.ItemRepository.Create(item); err != nil {
		return nil, err
	}

	return r.Resolver.Query().Item(ctx, item.ID)
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
func (r *queryResolver) Item(ctx context.Context, id uuid.UUID) (*gql.Item, error) {
	var gqlItem gql.Item
	var gqlItemGroup gql.ItemGroup

	item, err := r.ItemRepository.Get(id)

	if err != nil {
		return nil, err
	}

	gqlItem.ID = item.ID
	gqlItem.Pid = item.PID
	gqlItem.CreatedAt = item.CreatedAt
	gqlItem.UpdatedAt = item.UpdatedAt

	if item.GroupID != nil {
		group, err := r.ItemGroupRepository.Get(*item.GroupID)

		if err != nil {
			return nil, err
		}

		gqlItemGroup.ID = group.ID
		gqlItemGroup.Name = group.Name
		gqlItemGroup.CreatedAt = group.CreatedAt
		gqlItemGroup.UpdatedAt = group.UpdatedAt

		gqlItem.Group = &gqlItemGroup
	}

	return &gqlItem, nil
}

// Items is the resolver for the items field.
func (r *queryResolver) Items(ctx context.Context, limit int, offset *int, filters []gql.ItemsFilter) ([]gql.Item, error) {
	var gqlItems []gql.Item

	MAX_LIMIT := 100
	if limit > MAX_LIMIT {
		return nil, fmt.Errorf("validation: limit may not exceed %d", MAX_LIMIT)
	}

	items, err := r.ItemRepository.List(limit, offset, filters)

	if err != nil {
		return nil, err
	}

	settings, err := r.SettingsRepository.Get()

	if err != nil {
		return nil, err
	}

	// DUMB SOLUTION: should fix in repository for better optimization
	for _, item := range items {
		var gqlItem gql.Item

		gqlItem.ID = item.ID
		gqlItem.Pid = item.PID
		gqlItem.CreatedAt = item.CreatedAt
		gqlItem.UpdatedAt = item.UpdatedAt

		// GROUP
		if item.GroupID != nil {
			var gqlItemGroup gql.ItemGroup

			group, err := r.ItemGroupRepository.Get(*item.GroupID)

			if err != nil {
				return nil, err
			}

			gqlItemGroup.ID = group.ID
			gqlItemGroup.Name = group.Name
			gqlItemGroup.CreatedAt = group.CreatedAt
			gqlItemGroup.UpdatedAt = group.UpdatedAt

			gqlItem.Group = &gqlItemGroup
		}

		// GLOBAL field
		globalCustomFields, err := r.AbstractCustomFieldFactory.CombineToGqlCustomFields(settings.ItemsGlobalCustomFields.V, item.GlobalCustomFieldsValues)

		if err != nil {
			return nil, err
		}

		gqlItem.GlobalCustomFields = append(gqlItem.GlobalCustomFields, globalCustomFields...)

		// LOCAL fields
		localCustomFields, err := r.AbstractCustomFieldFactory.ConvertToGqlCustomFields(item.LocalCustomFields.V)

		if err != nil {
			return nil, err
		}

		gqlItem.LocalCustomFields = append(gqlItem.LocalCustomFields, localCustomFields...)

		// Add item to list
		gqlItems = append(gqlItems, gqlItem)
	}

	return gqlItems, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
