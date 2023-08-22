package resolver

//go:generate go run github.com/99designs/gqlgen generate --config ../config/gqlgen.yml

import "invman/api/internal/app/repository"

type Resolver struct {
	ServiceRepository repository.Service
}
