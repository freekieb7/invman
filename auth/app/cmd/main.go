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
	db.Exec("CREATE TYPE role_type AS ENUM ('ADMIN','USER');")

	db.AutoMigrate(&entity.Account{})

	// Prepare server
	server := server.New(db)
	router := router.New(db, server)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
