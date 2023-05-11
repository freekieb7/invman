package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"invman.com/service-api/src/db"
	"invman.com/service-api/src/http"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/registry"
)

type User struct {
	Song   string
	Artist string
	Year   uint8
}

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	dbConn := db.NewPool()
	dbConn.AutoMigrate(&model.Service{})

	registry := registry.NewRegistry(dbConn)
	controller := registry.NewController()
	processor := http.NewProcessor(router)

	processor.GET("", func(req http.Request, res http.Response) {
		res.SendJson(gin.H{"message": "Connected"})
	})

	processor.GET("/v1/services", controller.Service.GetList)
	processor.GET("/v1/services/:id", controller.Service.Get)
	processor.POST("/v1/services", controller.Service.Create)
	processor.PUT("/v1/services/:id", controller.Service.Update)
	processor.DELETE("/v1/services/:id", controller.Service.Delete)

	router.Run("0.0.0.0:8080")
}
