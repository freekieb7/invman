package router

import (
	"net/http"
	"time"

	"invman/auth/internal/app/config/dependencies"
	"invman/auth/pkg/app/http/middleware"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/rs/cors"
)

type Router struct {
	chi *chi.Mux
}

func New(injection *dependencies.Dependencies) *Router {
	router := chi.NewRouter()

	// Middleware stack
	router.Use(chiMiddleware.RequestID)
	router.Use(chiMiddleware.RealIP)
	// router.Use(middleware.AccessLogger) // Log to files
	router.Use(chiMiddleware.Logger) // Log to console
	router.Use(chiMiddleware.Recoverer)
	router.Use(chiMiddleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	// Public files route
	router.Get("/*", injection.FileController.GetPublicFile)

	// Metrics routes
	router.Group(func(router chi.Router) {
		// TODO protect
		router.Get("/metrics", injection.MetricsController.ShowMetrics)
	})

	// Authentication routes
	router.Group(func(router chi.Router) {
		router.Use(middleware.SessionHandler)

		router.Get("/", injection.AuthenticationController.ShowSignIn)
		router.Post("/", injection.AuthenticationController.Signin)

		router.Get("/register", injection.RegistrationController.CompleteRegistration) // API call via mail
		router.Post("/register", injection.RegistrationController.Register)

		router.Get("/signinoption/password/forgot", injection.PasswordController.ShowForgotPassword)
		router.Post("/signinoption/password/forgot", injection.PasswordController.ForgotPassword)

		router.Get("/signinoption/password/reset", injection.PasswordController.ShowResetPassword)
		router.Post("/signinoption/password/reset", injection.PasswordController.ResetPassword)

		router.HandleFunc("/oauth/authorize", injection.OAuthController.HandleAuthorize)
		router.HandleFunc("/oauth/token", injection.OAuthController.HandleToken)
		router.Get("/oauth/me", injection.OAuthController.GetMe)
	})

	return &Router{
		chi: router,
	}
}

func (router *Router) ServeHTTP(response http.ResponseWriter, request *http.Request) {
	router.chi.ServeHTTP(response, request)
}
