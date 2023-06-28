package main

import (
	"log"
	"net/http"

	"invman.com/oauth/src/router"
	"invman.com/oauth/src/server"
)

func main() {
	// Prepare server
	server := server.New()
	router := router.New(server)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
