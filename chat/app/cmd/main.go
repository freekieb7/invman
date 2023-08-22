// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"
	"net/http"

	"invman.nl/chat/src/router"
)

func main() {
	router := router.New()

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
