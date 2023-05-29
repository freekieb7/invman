package router

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	QueryPath      = "/query"
	PlaygroundPath = "/"
)

// New creates route endpoint
func New(srv *handler.Server) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	// r.POST("/query", graphqlHandler())
	// r.GET("/", playgroundHandler())

	// r.Use(middleware.Logger)
	// r.Use(middleware.Recoverer)

	router.POST(QueryPath, func(c *gin.Context) {
		srv.ServeHTTP(c.Writer, c.Request)
	})

	playgroundServer := playground.Handler("GraphQL", QueryPath)
	router.GET(PlaygroundPath, func(c *gin.Context) {
		playgroundServer.ServeHTTP(c.Writer, c.Request)
	})

	return router
}
