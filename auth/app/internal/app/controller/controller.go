package controller

import (
	"html/template"
	"invman/auth/internal/app/repository"
	oauth2_server "invman/auth/internal/pkg/oauth2/server"
)

type Controller struct {
	Sign  *signController
	OAuth *oAuthController
}

func New(templater *template.Template, oauthServer *oauth2_server.Server, repository *repository.Repository) *Controller {
	return &Controller{
		Sign:  newSignController(templater, repository),
		OAuth: newOAuthController(oauthServer, repository),
	}
}
