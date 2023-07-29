package router

import (
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/jwtauth/v5"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

const (
	HealthPath     = "/health"
	MetricsPath    = "/metrics"
	QueryPath      = "/query"
	PlaygroundPath = "/query/playground"
)

func New(gqlResolver *handler.Server) *chi.Mux {
	router := chi.NewRouter()

	// A good base middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	// Set a timeout value on the request context (ctx), that will signal
	// through ctx.Done() that the request has timed out and further
	// processing should be stopped.
	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("APP_URL")},
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	// Protected routes
	router.Group(func(router chi.Router) {
		router.Use(jwtauth.Verifier(jwtauth.New("HS512", []byte(os.Getenv("ACCESS_TOKEN_SECRET")), nil)))
		router.Use(jwtauth.Authenticator)

		router.Handle(PlaygroundPath, playground.Handler("GraphQL", QueryPath))
		router.Handle(QueryPath, gqlResolver)
	})

	// Public routes
	router.Group(func(r chi.Router) {
		router.Get(HealthPath, func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Healthy"))
		})

		router.Get(MetricsPath, promhttp.Handler().ServeHTTP)
	})

	return router
}
