package router

import (
	"github.com/DanielHGim/shrek-run/api/src/config/router/route"
	"github.com/gorilla/mux"
)

func Build() *mux.Router {
	router := mux.NewRouter()

	routeList := route.PartyRoutes

	for _, route := range routeList {
		router.HandleFunc(route.URI, route.Func).Methods(route.Method)
	}
	return router
}
