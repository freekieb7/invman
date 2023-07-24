//go:generate go run github.com/99designs/gqlgen generate
package resolver

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"gorm.io/gorm"
	"invman.com/graphql/graph/generated"
	"invman.com/graphql/src/repository"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	serviceRepository repository.Service
}

func NewResolver(db *gorm.DB) *handler.Server {
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{
		serviceRepository: repository.NewServiceRepository(db),
	}}))
}
