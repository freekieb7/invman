package factory

import "invman/api/pkg/app/database/entity"

type itemGroupFactory struct{}

type ItemGroupFactory interface {
	New() entity.ItemGroup
}

func NewItemGroupFactory() ItemGroupFactory {
	return &itemGroupFactory{}
}

func (factory *itemGroupFactory) New() entity.ItemGroup {
	return entity.ItemGroup{}
}
