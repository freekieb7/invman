package http

import (
	"encoding/json"
	"io"
	"net/http"
)

type Response interface {
	MapBodyTo(value any) error
}

type response struct {
	statusCode int
	body       io.ReadCloser
}

func NewResponse(resp *http.Response) Response {
	return &response{
		statusCode: resp.StatusCode,
		body:       resp.Body,
	}
}

func (r *response) MapBodyTo(value any) error {
	defer r.body.Close()
	return json.NewDecoder(r.body).Decode(&value)
}
