package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/DanielHGim/shrek-run/api/src/config/cors"
	"github.com/DanielHGim/shrek-run/api/src/config/env"
	"github.com/DanielHGim/shrek-run/api/src/config/router"
	"github.com/DanielHGim/shrek-run/api/src/storage"
)

const (
	port = 9000
)

func main() {
	env.Init()
	storage.Init()
	r := router.Build()
	h := cors.Build(r)

	log.Println("Listening to port", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), h))
}
