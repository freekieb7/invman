package render

import (
	"encoding/json"
	"errors"
	"net/http"
	"unicode"
)

type responseBody struct {
	Message string `json:"message"`
}

func Success(response http.ResponseWriter, message string) {
	render(response, message, http.StatusOK)
}

func ErrInternalServerError(response http.ResponseWriter, err error) {
	if err == nil {
		err = errors.New("internal server error occurred")
	}

	render(response, err.Error(), http.StatusInternalServerError)
}

func ErrForbidden(response http.ResponseWriter, err error) {
	if err == nil {
		err = errors.New("forbidden")
	}

	render(response, err.Error(), http.StatusForbidden)
}

func ErrNotFound(response http.ResponseWriter, err error) {
	if err == nil {
		err = errors.New("not found")
	}

	render(response, err.Error(), http.StatusNotFound)
}

func ErrUnprocessableContent(response http.ResponseWriter, err error) {
	if err == nil {
		err = errors.New("unprocessable content")
	}

	render(response, err.Error(), http.StatusUnprocessableEntity)
}

func render(response http.ResponseWriter, message string, code int) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(code)

	// Capitalize first character
	r := []rune(message)
	r[0] = unicode.ToUpper(r[0])
	message = string(r)

	json.NewEncoder(response).Encode(responseBody{
		Message: message,
	})
}
