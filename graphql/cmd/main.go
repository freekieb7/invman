package main

import (
	"log"
	"net/http"

	"invman.com/graphql/src/infra/database"
	"invman.com/graphql/src/infra/database/entity"
	"invman.com/graphql/src/infra/router"
	"invman.com/graphql/src/resolver"
)

func main() {
	// Setup Database connection
	db := database.NewPool()
	db.AutoMigrate(&entity.Service{})

	// Prepare server
	server := resolver.NewServer(db)
	router := router.New(server)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
