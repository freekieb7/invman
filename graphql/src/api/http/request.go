package http

import (
	"bytes"
	"net/http"
)

type request struct {
	client http.Client
}

type Request interface {
	Get(url string, headers map[string]string, content []byte) Response
	// Post()Client
	// Put()
	// Delete()
}

func NewRequest() Request {
	return &request{
		client: http.Client{},
	}
}

func (r *request) Get(url string, headers map[string]string, content []byte) (Response, error) {
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(content))
	req.Header.Set("Content-Type", "application/json")

	if err != nil {
		return nil, err
	}

	resp, err := r.client.Do(req)

	if err != nil {
		return nil, err
	}

	return &response{}
}
