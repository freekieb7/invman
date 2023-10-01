package router

import (
	"invman/api/internal/app/config/dependencies"
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
		router.Handle("/", injection.GraphqlHandler)
		router.Handle("/playground", playground.Handler("GraphQL", "/"))
	})

	// Monitor routes (Internal use only)
	router.Group(func(r chi.Router) {
		// TODO add protection
		router.Get("/metrics", injection.MetricsController.Metrics)
	})

	return router
}
