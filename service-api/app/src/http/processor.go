package http

import "github.com/gin-gonic/gin"

type Processor interface {
	GET(endpoint string, handler ControllerFunc) gin.IRoutes
	POST(endpoint string, handler ControllerFunc) gin.IRoutes
	PUT(endpoint string, handler ControllerFunc) gin.IRoutes
	DELETE(endpoint string, handler ControllerFunc) gin.IRoutes
}

type processor struct {
	router *gin.Engine
}

type ControllerFunc func(req Request, res Response)

func NewProcessor(router *gin.Engine) Processor {
	return &processor{
		router: router,
	}
}

func (p *processor) GET(endpoint string, handler ControllerFunc) gin.IRoutes {
	return p.router.GET(endpoint, func(ctx *gin.Context) {
		req := NewRequest(ctx)
		res := NewResponse(ctx)

		handler(req, res)
	})
}

func (p *processor) POST(endpoint string, handler ControllerFunc) gin.IRoutes {
	return p.router.POST(endpoint, func(ctx *gin.Context) {
		req := NewRequest(ctx)
		res := NewResponse(ctx)

		handler(req, res)
	})
}

func (p *processor) PUT(endpoint string, handler ControllerFunc) gin.IRoutes {
	return p.router.PUT(endpoint, func(ctx *gin.Context) {
		req := NewRequest(ctx)
		res := NewResponse(ctx)

		handler(req, res)
	})
}

func (p *processor) DELETE(endpoint string, handler ControllerFunc) gin.IRoutes {
	return p.router.DELETE(endpoint, func(ctx *gin.Context) {
		req := NewRequest(ctx)
		res := NewResponse(ctx)

		handler(req, res)
	})
}
