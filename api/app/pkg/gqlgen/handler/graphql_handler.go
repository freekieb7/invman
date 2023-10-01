package handler

import (
	"invman/api/pkg/app/factory"
	"invman/api/pkg/app/repository"
	"invman/api/pkg/gqlgen/generated"
	"invman/api/pkg/gqlgen/resolver"

	"github.com/99designs/gqlgen/graphql/handler"
)

func New(
	itemFactory factory.ItemFactory,
	itemGroupFactory factory.ItemGroupFactory,
	textCustomFieldFactory factory.TextCustomFieldFactory,
	itemRepository repository.ItemRepository,
	itemGroupRepository repository.ItemGroupRepository,
	settingsRepository repository.SettingsRepository,
) *handler.Server {
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &resolver.Resolver{
		ItemFactory:            itemFactory,
		ItemGroupFactory:       itemGroupFactory,
		TextCustomFieldFactory: textCustomFieldFactory,
		ItemRepository:         itemRepository,
		ItemGroupRepository:    itemGroupRepository,
		SettingsRepository:     settingsRepository,
	}}))
}
