package route

import (
	"net/http"

	"github.com/DanielHGim/shrek-run/api/src/controller"
)

var PartyRoutes = []Route{
	{
		URI:    "/party",
		Method: http.MethodPost,
		Func:   controller.CreateParty,
	},
	{
		URI:    "/party/{id}/member",
		Method: http.MethodGet,
		Func:   controller.ConnectToParty,
	},
	{
		URI:    "/party/{id}/joy",
		Method: http.MethodPost,
		Func:   controller.StartParty,
	},
}
