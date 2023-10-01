package resolver

import (
	"invman/api/pkg/app/factory"
	"invman/api/pkg/app/repository"
)

//go:generate go run github.com/99designs/gqlgen generate --config ../config/gqlgen.yml

type Resolver struct {
	ItemFactory            factory.ItemFactory
	ItemGroupFactory       factory.ItemGroupFactory
	TextCustomFieldFactory factory.TextCustomFieldFactory
	ItemRepository         repository.ItemRepository
	ItemGroupRepository    repository.ItemGroupRepository
	SettingsRepository     repository.SettingsRepository
}
