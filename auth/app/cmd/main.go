package main

import (
	"log"
	"net/http"

	"invman/auth/internal/app/config/dependencies"
	"invman/auth/pkg/app/datasource/database/migration"
	"invman/auth/pkg/app/http/router"
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
