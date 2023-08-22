package router

import (
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

const (
	pingPath           string = "/"
	metricsPath        string = "/metrics"
	queryPath          string = "/query"
	playgroundPath     string = "/query/playground"
)

func New(gqlHandler *handler.Server) *chi.Mux {
	router := chi.NewRouter()

	// A good base middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("APP_URL")},
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	// Public routes
	router.Group(func(r chi.Router) {
		router.Get(pingPath, func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Pong"))
		})
	})

	// Graphql routes
	router.Group(func(router chi.Router) {
		// TODO Disable in prod
		router.Handle(playgroundPath, playground.Handler("GraphQL", queryPath))

		router.Handle(queryPath, gqlHandler)
	})

	// Monitor routes (Internal use only)
	router.Group(func(r chi.Router) {
		// TODO add protection
		router.Get(metricsPath, promhttp.Handler().ServeHTTP)
	})

	return router
}
