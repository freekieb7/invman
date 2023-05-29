//go:generate go run github.com/99designs/gqlgen generate
package resolver

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"invman.com/graphql/graph/generated"
	"invman.com/graphql/src/usecase"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	usecases usecase.UsecaseCollection
}

func NewServer(usecases usecase.UsecaseCollection) *handler.Server {
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &Resolver{
		usecases: usecases,
	}}))
}
