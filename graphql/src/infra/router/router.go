package router

import (
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"invman.com/graphql/src/infra/middleware"
)

const (
	QueryPath      = "/query"
	PlaygroundPath = "/"
)

// New creates route endpoint
func New(srv *handler.Server) *gin.Engine {
	router := gin.Default()
	// router.Use(cors.Default())

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowHeaders: []string{"authorization", "content-type"},
		AllowOrigins: []string{os.Getenv("INVMAN_APP_URL")},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
	}))

	router.Use(middleware.AuthUser())

	router.POST(QueryPath, func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	})

	playgroundServer := playground.Handler("GraphQL", QueryPath)
	router.GET(PlaygroundPath, func(c *gin.Context) {
		playgroundServer.ServeHTTP(c.Writer, c.Request)
	})

	return router
}
