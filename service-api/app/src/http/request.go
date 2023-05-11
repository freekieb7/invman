package http

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Request interface {
	GetUrlParamInt(name string) (int, error)
	GetQueryParamString(name string, fallback string) string
	GetQueryParamInt(name string, fallback int) (int, error)
	BindJsonBody(target any) error
}

type request struct {
	ctx *gin.Context
}

func NewRequest(ctx *gin.Context) Request {
	return &request{
		ctx: ctx,
	}
}

func (r *request) GetUrlParamInt(name string) (int, error) {
	result := r.ctx.Param(name)

	if result == "" {
		return 0, fmt.Errorf("url parameter '%s' is not available", name)
	}

	parsedResult, err := strconv.Atoi(result)

	if err != nil {
		return 0, fmt.Errorf("url parameter '%s' is not a valid number", name)
	}

	return parsedResult, nil
}

func (r *request) GetQueryParamString(name string, fallback string) string {
	return r.ctx.DefaultQuery(name, fallback)
}

func (r *request) GetQueryParamInt(name string, fallback int) (int, error) {
	result, err := strconv.Atoi(r.ctx.DefaultQuery(name, fmt.Sprint(fallback)))

	if err != nil {
		return 0, fmt.Errorf("url parameter %s is not a valid number", name)
	}

	return result, nil
}

func (r *request) BindJsonBody(target any) error {
	if err := r.ctx.ShouldBindJSON(&target); err != nil {
		return errors.New("unable to process request body")
	}

	return nil
}
