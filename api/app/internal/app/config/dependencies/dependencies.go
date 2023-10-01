package dependencies

import (
	"invman/api/internal/app/config"
	"invman/api/pkg/app/controller"
	"invman/api/pkg/app/database"
	"invman/api/pkg/app/factory"
	"invman/api/pkg/app/repository"
	"invman/api/pkg/app/validater"
	gqlHandler "invman/api/pkg/gqlgen/handler"

	gqlgen "github.com/99designs/gqlgen/graphql/handler"
)

type Dependencies struct {
	Database          database.Database
	GraphqlHandler    *gqlgen.Server
	MetricsController *controller.MetricsController
}

func New() *Dependencies {
	config := config.New()

	// Datasources
	database := database.New(config.Database)

	// Factory
	itemFactory := factory.NewItemFactory()
	itemGroupFactory := factory.NewItemGroupFactory()
	settingsFactory := factory.NewSettingsFactory()
	textCustomFieldFactory := factory.NewTextCustomFieldFactory()
	abstractCustomFieldFactory := factory.NewAbstractCustomFieldConverter(textCustomFieldFactory)

	// Validaters
	itemValidater := validater.NewItemValidater()

	// Repositories
	itemRepository := repository.NewItemRepository(database, itemValidater)
	itemGroupRepository := repository.NewItemGroupRepository(database)
	settingsRepository := repository.NewSettingsRepository(database, settingsFactory)

	// Graphql
	graphqlHandler := gqlHandler.New(
		itemFactory,
		itemGroupFactory,
		abstractCustomFieldFactory,
		itemRepository,
		itemGroupRepository,
		settingsRepository,
	)

	// Controller
	metricsController := controller.NewMetricsController()

	return &Dependencies{
		Database:          database,
		GraphqlHandler:    graphqlHandler,
		MetricsController: metricsController,
	}
}
