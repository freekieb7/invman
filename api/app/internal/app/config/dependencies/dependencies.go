package dependencies

import (
	"invman/api/internal/app/config"
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/http/controller"
	"invman/api/pkg/app/repository"
	gqlHandler "invman/api/pkg/gqlgen/handler"

	gqlgen "github.com/99designs/gqlgen/graphql/handler"
)

type Dependencies struct {
	Database          *database.Database
	GraphqlHandler    *gqlgen.Server
	MetricsController *controller.MetricsController
}

func New() *Dependencies {
	config := config.New()

	// Datasources
	database := database.New(config.Database)

	// Repositories
	itemRepository := repository.NewItemRepository(database)

	// Graphql
	graphqlHandler := gqlHandler.New(itemRepository)

	// Controller
	metricsController := controller.NewMetricsController()

	return &Dependencies{
		Database:          database,
		GraphqlHandler:    graphqlHandler,
		MetricsController: metricsController,
	}
}
