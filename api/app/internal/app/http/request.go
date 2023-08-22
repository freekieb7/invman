package http

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type request struct {
	client      http.Client
	headers     map[string]string
	queryParams map[string]string
}

type Request interface {
	SetHeader(name string, value string) Request
	AddQueryParam(name string, value string) Request
	Get(url string) (Response, error)
	Post(url string, content []byte) (Response, error)
	Put(url string, content []byte) (Response, error)
	Delete(url string) (Response, error)
}

func NewRequest() Request {
	return &request{
		client:      http.Client{},
		headers:     make(map[string]string),
		queryParams: make(map[string]string),
	}
}

func (r *request) SetHeader(name string, value string) Request {
	r.headers[name] = value
	return r
}

func (r *request) AddQueryParam(name string, value string) Request {
	r.queryParams[name] = value
	return r
}

func (r *request) Get(url string) (Response, error) {
	return r.handleRequest(http.MethodGet, url, nil)
}

func (r *request) Post(url string, content []byte) (Response, error) {
	return r.handleRequest(http.MethodPost, url, bytes.NewBuffer(content))
}

func (r *request) Put(url string, content []byte) (Response, error) {
	return r.handleRequest(http.MethodPut, url, bytes.NewBuffer(content))
}

func (r *request) Delete(url string) (Response, error) {
	return r.handleRequest(http.MethodDelete, url, nil)
}

func (r *request) handleRequest(method string, url string, body io.Reader) (Response, error) {
	queryParamParts := make([]string, 0, len(r.queryParams))

	for k, v := range r.queryParams {
		queryParamParts = append(queryParamParts, fmt.Sprintf("%s=%s", k, v))
	}

	if len(queryParamParts) > 0 {
		url += "?" + strings.Join(queryParamParts, "&")
	}

	req, err := http.NewRequest(method, url, body)

	if err != nil {
		return nil, err
	}

	for k, v := range r.headers {
		req.Header.Set(k, v)
	}

	resp, err := r.client.Do(req)

	if err != nil {
		return nil, err
	}

	response := NewResponse(resp)
	return response, nil
}
