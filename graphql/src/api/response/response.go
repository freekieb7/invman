package response

import "net/http"

type httpResponse struct {
	http *http.Response
}

type HttpResponse interface {
}

func NewHttpResponse(http *http.Response) HttpResponse {
	return &httpResponse{
		http: http,
	}
}
