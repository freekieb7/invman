package router

import (
	"fmt"
	"invman/api/internal/app/config"
	"invman/api/internal/app/config/dependencies"
	"invman/api/pkg/app/authentication"
	"invman/api/pkg/app/database/migration"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
)

const (
	pingPath       string = "/"
	metricsPath    string = "/metrics"
	queryPath      string = "/query"
	playgroundPath string = "/query/playground"
)

func New(injection *dependencies.Dependencies) *chi.Mux {
	router := chi.NewRouter()

	// A good base middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	// Graphql routes
	router.Group(func(router chi.Router) {
		if injection.Config.Mode == config.DevelopmentMode {
			router.Handle("/playground", playground.Handler("GraphQL", "/introspection"))
			router.Handle("/introspection", injection.GraphqlHandler)
		}

		router.Group(func(router chi.Router) {
			router.Use(authentication.Middleware(injection.Database))
			router.Handle("/", injection.GraphqlHandler)
		})
	})

	// Monitor routes (Internal use only)
	router.Group(func(r chi.Router) {
		// TODO add protection
		router.Post("/create_storage", func(w http.ResponseWriter, r *http.Request) {
			companyId := r.URL.Query().Get("companyId")

			// Create new schema
			injection.Database.Exec(fmt.Sprintf(`CREATE SCHEMA "%s"`, companyId))
			injection.Database.Exec(fmt.Sprintf(`SET search_path TO "%s";`, companyId))

			// Attempt DB Migration
			migrater := migration.New(injection.Database)
			migrater.Up()
		})
		router.Get("/metrics", injection.MetricsController.Metrics)
	})

	return router
}
