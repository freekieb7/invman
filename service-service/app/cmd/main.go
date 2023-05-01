package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type User struct {
	Song   string
	Artist string
	Year   uint8
}

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, User{
			Song:   "John",
			Artist: "Doe",
			Year:   25,
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
