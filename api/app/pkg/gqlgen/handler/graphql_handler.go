package handler

import (
	"invman/api/pkg/app/datasource/database/entity"
	"invman/api/pkg/app/repository"
	"invman/api/pkg/gqlgen/generated"
	"invman/api/pkg/gqlgen/resolver"

	"github.com/99designs/gqlgen/graphql/handler"
)

func New(
	itemFactory entity.ItemFactory,
	itemRepository repository.ItemRepository,
	textCustomFieldFactory entity.TextCustomFieldFactory,
	itemGroupRepository repository.ItemGroupRepository,
	settingsRepository repository.SettingsRepository,
) *handler.Server {
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &resolver.Resolver{
		ItemFactory:            itemFactory,
		TextCustomFieldFactory: textCustomFieldFactory,
		ItemRepository:         itemRepository,
		ItemGroupRepository:    itemGroupRepository,
		SettingsRepository:     settingsRepository,
	}}))
}
