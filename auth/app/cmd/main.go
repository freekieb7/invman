package main

import (
	"html/template"
	"log"
	"net/http"

	"invman/auth/internal/app/config"
	"invman/auth/internal/app/controller"
	"invman/auth/internal/app/database"
	"invman/auth/internal/app/database/migration"
	"invman/auth/internal/app/redis"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/router"
	"invman/auth/internal/pkg/oauth2/server"
)

func main() {
	// Setup Database
	cnf, _ := config.Load()
	database := database.New(&cnf.Db)

	// Setup Redis
	redis := redis.New(&cnf.Auth.Redis)

	// Setup Migrater
	migrater := migration.New(database)

	if err := migrater.Up(); err != nil {
		panic(err)
	}

	// Controller
	templateServer, err := template.ParseGlob("web/template/*")

	if err != nil {
		panic(err)
	}

	// Setup server
	repo := repository.New(database, redis)
	oauthServer := server.New(&cnf.Auth, repo)
	controller := controller.New(templateServer, oauthServer, repo, &cnf.Server)

	router := router.New(controller)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
