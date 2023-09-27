package resolver

import "invman/api/pkg/app/repository"

//go:generate go run github.com/99designs/gqlgen generate --config ../config/gqlgen.yml

type Resolver struct {
	ItemRepository      *repository.ItemRepository
	ItemGroupRepository *repository.ItemGroupRepository
	SettingsRepository  *repository.SettingsRepository
}
