package main

import (
	"log"
	"net/http"

	"invman/api/internal/app/config/dependencies"
	"invman/api/pkg/app/database/migration"
	"invman/api/pkg/app/router"
)

func main() {
	dependencies := dependencies.New()

	// Attempt DB Migration
	migrater := migration.New(dependencies.Database)
	migrater.Up()

	// Run router
	router := router.New(dependencies)
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
