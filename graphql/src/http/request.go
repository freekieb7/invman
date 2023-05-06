package http

import (
	"bytes"
	"net/http"
)

type request struct {
	client  http.Client
	headers map[string]string
}

type Request interface {
	SetHeader(name string, value string) Request
	Get(url string) (Response, error)
	Post(url string, content []byte) (Response, error)
	Put(url string, content []byte) (Response, error)
	Delete(url string) (Response, error)
}

func NewRequest() Request {
	return &request{
		client:  http.Client{},
		headers: make(map[string]string),
	}
}

func (r *request) SetHeader(name string, value string) Request {
	r.headers[name] = value
	return r
}

func (r *request) Get(url string) (Response, error) {
	return r.toResponse(http.NewRequest(http.MethodGet, url, bytes.NewBuffer([]byte{})))
}

func (r *request) Post(url string, content []byte) (Response, error) {
	return r.toResponse(http.NewRequest(http.MethodPost, url, bytes.NewBuffer(content)))
}

func (r *request) Put(url string, content []byte) (Response, error) {
	return r.toResponse(http.NewRequest(http.MethodPut, url, bytes.NewBuffer(content)))
}

func (r *request) Delete(url string) (Response, error) {
	var content []byte
	req, err := http.NewRequest(http.MethodDelete, url, bytes.NewBuffer(content))

	if err != nil {
		return nil, err
	}

	for k, v := range r.headers {
		req.Header.Set(k, v)
	}

	return r.toResponse(http.NewRequest(http.MethodDelete, url, bytes.NewBuffer(content)))
}

func (r *request) toResponse(req *http.Request, err error) (Response, error) {
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	resp, err := r.client.Do(req)

	if err != nil {
		return nil, err
	}

	response := NewResponse(resp)
	return response, nil
}
