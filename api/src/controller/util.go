package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func getBody(r *http.Request, wrapper any) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	if err = json.Unmarshal(body, wrapper); err != nil {
		return err
	}
	return nil
}

func getPathParam(pathParam string, r *http.Request) string {
	return mux.Vars(r)[pathParam]
}

func getQueryParam(queryParam string, r *http.Request) string {
	return r.URL.Query().Get(queryParam)
}

func ifErrorThenRespond(statusCode int, message string, w http.ResponseWriter, err error) error {
	if err != nil {
		w.WriteHeader(statusCode)
		w.Write([]byte(message))
	}
	return err
}

func respond(statusCode int, data any, w http.ResponseWriter) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if data != nil {
		if err := json.NewEncoder(w).Encode(data); err != nil {
			return err
		}
	}

	return nil
}
