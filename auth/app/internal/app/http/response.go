package http

import (
	"encoding/json"
	"net/http"
	"unicode"
)

type errorBody struct {
	Message string `json:"message"`
}

func ErrorResponse(response http.ResponseWriter, message string, code int) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(code)

	// Capitalize first character
	r := []rune(message)
	r[0] = unicode.ToUpper(r[0])
	s := string(r)

	json.NewEncoder(response).Encode(errorBody{
		Message: s,
	})
}
