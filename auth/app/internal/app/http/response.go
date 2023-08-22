package http

import (
	"encoding/json"
	"net/http"
)

type errorBody struct {
	Message string `json:"message"`
}

func ErrorResponse(response http.ResponseWriter, err string, code int) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(code)

	json.NewEncoder(response).Encode(errorBody{
		Message: "Credentials are incorrect",
	})
}
