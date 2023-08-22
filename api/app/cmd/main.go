package main

import (
	"log"
	"net/http"

	"invman/api/internal/app/database"
	"invman/api/internal/app/router"

	gqlHandler "invman/api/internal/pkg/gqlgen/handler"
)

func main() {
	// Setup Database connection
	db := database.New()

	// Prepare server
	gqlHandler := gqlHandler.New(db)

	router := router.New(gqlHandler)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
