package main

import (
	"errors"
	"html/template"
	"log"
	"net/http"

	"invman/auth/internal/app/config"
	"invman/auth/internal/app/controller"
	"invman/auth/internal/app/database"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/router"
	"invman/auth/internal/pkg/oauth2/server"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	// Setup Database
	cnf, _ := config.Load()
	db := database.NewConn(&cnf.DbConfig)

	// Migration
	driver, err := postgres.WithInstance(db, &postgres.Config{})

	if err != nil {
		panic(err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file:///app/internal/app/database/migration",
		"postgres", driver)

	if err != nil {
		panic(err)
	}

	if err := m.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			// Do nothing
		} else {
			panic(err)
		}
	}

	// Controller
	templateServer, err := template.ParseGlob("web/template/*")

	if err != nil {
		panic(err)
	}

	// Setup server
	repo := repository.New(db)
	server := server.New(&cnf.OAuthConfig, repo)
	controller := controller.New(templateServer, server, repo)

	router := router.New(controller)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
