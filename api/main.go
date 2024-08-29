package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/DanielHGim/shrek-run/api/src/config/router"
	"github.com/DanielHGim/shrek-run/api/src/storage"
)

const (
	port = 9000
)

func main() {
	r := router.Build()
	storage.Init()

	log.Println("Listening to port", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), r))
}
