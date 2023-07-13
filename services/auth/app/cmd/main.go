package main

import (
	"log"
	"net/http"

	"invman.com/oauth/src/infra/database"
	"invman.com/oauth/src/infra/database/entity"
	"invman.com/oauth/src/infra/router"
	"invman.com/oauth/src/server"
)

func main() {
	// Setup Database connection
	db := database.NewPool()
	db.AutoMigrate(&entity.User{})

	// Prepare server
	server := server.New(db)
	router := router.New(db, server)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
