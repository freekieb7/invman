package http

import (
	"github.com/gin-gonic/gin"
)

type Response interface {
	SendJson(data any)
	SendError(status int, err error)
}

type response struct {
	ctx *gin.Context
}

type Json map[string]any

func NewResponse(ctx *gin.Context) Response {
	return &response{
		ctx: ctx,
	}
}

func (r *response) SendJson(data any) {
	r.ctx.IndentedJSON(StatusOK, data)
}

func (r *response) SendError(status int, err error) {
	errorBody := make(map[string]interface{})
	errorBody["error"] = err.Error()

	r.ctx.IndentedJSON(status, errorBody)
}
