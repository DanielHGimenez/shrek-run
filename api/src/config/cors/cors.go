package cors

import (
	"net/http"
	"strings"

	"github.com/DanielHGim/shrek-run/api/src/config/env"
	"github.com/gorilla/handlers"
)

func Build(h http.Handler) http.Handler {
	cors := []handlers.CORSOption{
		handlers.AllowedOrigins([]string{env.AllowedOrigins}),
		handlers.AllowedMethods([]string{http.MethodGet, http.MethodPost, http.MethodHead, http.MethodOptions}),
		handlers.AllowedHeaders([]string{"Accept", "Accept-Language", "Content-Language", "Origin", "Content-Type"}),
		handlers.ExposedHeaders([]string{"*"}),
		handlers.OptionStatusCode(http.StatusOK),
	}

	return handlers.CORS(cors...)(h)
}

func CheckOriginWebSocket() func(r *http.Request) bool {
	if env.AllowedOrigins == "*" {
		return func (r *http.Request) bool {
			return true
		}
	}
	return func (r *http.Request) bool {
		origin := r.Header.Get("Origin")
		return strings.Contains(env.AllowedOrigins, origin)
	}
}
