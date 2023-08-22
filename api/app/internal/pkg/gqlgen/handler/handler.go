package handler

import (
	"database/sql"

	"invman/api/internal/app/repository"
	"invman/api/internal/pkg/gqlgen/generated"
	"invman/api/internal/pkg/gqlgen/resolver"

	"github.com/99designs/gqlgen/graphql/handler"
)

func New(db *sql.DB) *handler.Server {
	return handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &resolver.Resolver{
		ServiceRepository: repository.NewServiceRepository(db),
	}}))
}
