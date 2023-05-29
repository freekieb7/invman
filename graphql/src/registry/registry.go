package registry

import (
	"gorm.io/gorm"
	"invman.com/graphql/src/repository"
	"invman.com/graphql/src/usecase"
)

type registry struct {
	db *gorm.DB
}

// Registry is an interface of registry
type Registry interface {
	NewUsecaseCollection() usecase.UsecaseCollection
}

// New registers entire controller with dependencies
func New(db *gorm.DB) Registry {
	return &registry{
		db: db,
	}
}

// NewController generates controllers
func (r *registry) NewUsecaseCollection() usecase.UsecaseCollection {
	return usecase.UsecaseCollection{
		Service: usecase.NewServiceUsecase(repository.NewServiceRepository(r.db)),
	}
}
