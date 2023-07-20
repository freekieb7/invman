package http

import (
	"github.com/gin-gonic/gin"
)

type ResponseBody struct {
	Error   *string `json:"error,omitempty"`
	Data    any     `json:"data"`
	Message *string `json:"message,omitempty"`
}

type Response interface {
	SendJson(body ResponseBody)
	SendError(status int, message string)
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

func (r *response) SendJson(data ResponseBody) {
	r.ctx.IndentedJSON(StatusOK, data)
}

func (r *response) SendError(status int, message string) {
	r.ctx.IndentedJSON(status, ResponseBody{
		Error: &message,
	})
}
