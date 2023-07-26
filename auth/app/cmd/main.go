package main

import (
	"log"
	"net/http"

	"invman.com/oauth/src/config"
	"invman.com/oauth/src/database"
	"invman.com/oauth/src/database/entity"
	"invman.com/oauth/src/router"
	"invman.com/oauth/src/server"
)

func main() {
	// Setup Database
	cnf, _ := config.Load()
	db := database.NewConn(&cnf.DbConfig)
	// db.Exec("CREATE TYPE role_type AS ENUM ('ADMIN','USER');")

	db.AutoMigrate(&entity.Account{})

	// Setup server
	server := server.New(&cnf.OAuthConfig, db)
	router := router.New(db, server)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
