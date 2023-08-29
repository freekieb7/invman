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
	rootPath    = "/"
	metricsPath = "/metrics"

	signupPath        = "/signup"
	signupSuccessPath = "/signup/success"

	signinPath    = "/signin"
	authorizePath = "/authorize"

	verifyPath              = "/verify"
	verifyResendPath        = "/verify/resend"
	verifyResendSuccessPath = "/verify/resend/success"

	oAuthAuthorizePath = "/oauth/authorize"
	oAuthTokenPath     = "/oauth/token"
	oAuthMePath        = "/oauth/me"
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

	// Public routes
	router.Group(func(router chi.Router) {
		router.Get(rootPath, func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) })
		router.Handle("/*", http.FileServer(http.Dir("web/public")))
	})

	// Metrics routes
	router.Group(func(router chi.Router) {
		// TODO protect
		router.Get(metricsPath, promhttp.Handler().ServeHTTP)
	})

	// Authentication routes
	router.Group(func(router chi.Router) {
		router.Use(middleware.SessionHandler)

		router.Get(signupPath, controller.Sign.GetSignup)
		router.Get(signupSuccessPath, controller.Sign.GetSignupSuccess)
		router.Post(signupPath, controller.Sign.PostSignup)

		router.Get(signinPath, controller.Sign.GetSignin)
		router.Post(signinPath, controller.Sign.PostSignin)

		router.Get(authorizePath, controller.Sign.GetAuthorize)
		router.Get(verifyPath, controller.Sign.GetVerify)

		router.Get(verifyResendPath, controller.Sign.GetVerifyResend)
		router.Post(verifyResendPath, controller.Sign.PostVerifyResend)
		router.Get(verifyResendSuccessPath, controller.Sign.GetVerifyResendSuccess)

		router.HandleFunc(oAuthAuthorizePath, controller.OAuth.HandleAuthorize)
		router.HandleFunc(oAuthTokenPath, controller.OAuth.HandleToken)
		router.Get(oAuthMePath, controller.OAuth.GetMe)
	})

	return router
}
