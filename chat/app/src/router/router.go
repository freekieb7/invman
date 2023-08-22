package router

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
	"invman.nl/chat/src/websocket"
)

const (
	HealthPath    = "/health"
	MetricsPath   = "/metrics"
	WebSocketPath = "/ws"
)

func New() *chi.Mux {
	router := chi.NewRouter()

	// Middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // Allow all
	}).Handler)

	// Public routes
	router.Group(func(router chi.Router) {
		router.Get(HealthPath, func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Healthy"))
		})

		router.Get(MetricsPath, promhttp.Handler().ServeHTTP)
	})

	// Protected routes
	router.Group(func(router chi.Router) {
		hub := websocket.NewHub()
		go hub.Run()

		router.Get("/ws", func(w http.ResponseWriter, r *http.Request) {
			websocket.ServeWs(hub, w, r)
		})
	})

	return router
}
