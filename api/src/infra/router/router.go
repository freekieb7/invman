package router

import (
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"invman.com/graphql/src/infra/middleware"
)

const (
	HealthPath     = "/health"
	MetricsPath    = "/metrics"
	QueryPath      = "/query"
	PlaygroundPath = "/"
)

func New(srv *handler.Server) *gin.Engine {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowHeaders: []string{"authorization", "content-type"},
		AllowOrigins: []string{os.Getenv("APP_URL")},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
	}))

	router.GET(HealthPath, func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"health": "Healthy!",
		})
		return
	})

	router.GET(MetricsPath, func(c *gin.Context) {
		promhttp.Handler().ServeHTTP(c.Writer, c.Request)
		return
	})

	router.Use(middleware.AuthUser())
	{
		router.POST(QueryPath, func(c *gin.Context) {
			srv.ServeHTTP(c.Writer, c.Request)
		})

		playgroundServer := playground.Handler("GraphQL", QueryPath)
		router.GET(PlaygroundPath, func(c *gin.Context) {
			playgroundServer.ServeHTTP(c.Writer, c.Request)
		})
	}

	return router
}
