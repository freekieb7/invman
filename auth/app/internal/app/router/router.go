package router

import (
	"net/http"
	"time"

	"invman/auth/internal/app/controller"
	"invman/auth/internal/app/middleware"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
)

type H map[string]any

const (
	pingPath        = "/"
	staticFilesPath = "/static/"

	metricsPath = "/api/metrics"

	signupPagePath = "/signup"
	signupPath     = "/api/signup"

	signinPagePath = "/signin"
	signinPath     = "/api/signin"

	authorizePagePath = "/authorize"
	authorizePath     = "/api/authorize"

	oAuthAuthorizePath = "/api/oauth/authorize"
	oAuthTokenPath     = "/api/oauth/token"
	oAuthMePath        = "/api/oauth/me"
)

func New(controller *controller.Controller) *chi.Mux {
	router := chi.NewRouter()

	// Middleware stack
	router.Use(chiMiddleware.RequestID)
	router.Use(chiMiddleware.RealIP)
	// router.Use(middleware.AccessLogger) // Log to file
	router.Use(chiMiddleware.Logger) // Log to console
	router.Use(chiMiddleware.Recoverer)
	router.Use(chiMiddleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	fileServer := http.FileServer(http.Dir("web/static"))

	// Public routes
	router.Group(func(router chi.Router) {
		router.Get(pingPath, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) })
		router.Handle(staticFilesPath, fileServer)
	})

	// Metrics routes
	router.Group(func(router chi.Router) {
		// TODO protect
		router.Get(metricsPath, promhttp.Handler().ServeHTTP)
	})

	// Authentication routes
	router.Group(func(router chi.Router) {
		router.Use(middleware.SessionHandler)

		router.Get(signupPagePath, controller.Auth.GetSignup)
		router.Post(signupPath, controller.Auth.PostSignup)

		router.Get(signinPagePath, controller.Auth.GetSignin)
		router.Post(signinPath, controller.Auth.PostSignin)

		router.Get(authorizePagePath, controller.Auth.GetAuthorize)
		router.Post(authorizePath, controller.Auth.PostAuthorize)

		router.HandleFunc(oAuthAuthorizePath, controller.OAuth2.HandleAuthorize)
		router.HandleFunc(oAuthTokenPath, controller.OAuth2.HandleToken)
		router.Get(oAuthMePath, controller.OAuth2.GetMe)
	})

	return router
}
