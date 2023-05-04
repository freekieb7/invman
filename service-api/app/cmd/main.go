package main

import (
	"net/http"

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

	r.GET("", func(ctx *gin.Context) {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Conntected"})
		return
	})
	r.GET("/v1/services", controller.Service.GetList)
	r.GET("/v1/services/:id", controller.Service.Get)
	r.POST("/v1/services", controller.Service.Create)
	r.PUT("/v1/services/:id", controller.Service.Update)
	r.DELETE("/v1/services/:id", controller.Service.Delete)

	r.Run("0.0.0.0:8080")
}
