package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"invman.com/service-api/src/db"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/registry"
)

type User struct {
	Song   string
	Artist string
	Year   uint8
}

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	dbConn := db.NewPool()

	dbConn.AutoMigrate(&model.Service{})

	registry := registry.NewRegistry(dbConn)
	controller := registry.NewController()

	r.GET("/services", controller.Service.Get)
	r.POST("/services", controller.Service.Create)
	r.PUT("/services/:id", controller.Service.Update)
	r.DELETE("/services/:id", controller.Service.Delete)

	r.Run() // listen and serve on 0.0.0.0:8080
}
