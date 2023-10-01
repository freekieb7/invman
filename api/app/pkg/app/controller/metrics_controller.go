package controller

import (
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type MetricsController struct {
}

func NewMetricsController() *MetricsController {
	return &MetricsController{}
}

func (controller *MetricsController) Metrics(response http.ResponseWriter, request *http.Request) {
	promhttp.Handler().ServeHTTP(response, request)
}
