package controller

import (
	"html/template"
	"invman/auth/internal/app/config"
	"invman/auth/internal/app/repository"
	oauth2_server "invman/auth/internal/pkg/oauth2/server"
)

type Controller struct {
	Sign  *signController
	OAuth *oAuthController
}

func New(templater *template.Template, oauthServer *oauth2_server.Server, repository *repository.Repository, config *config.ServerConfig) *Controller {
	return &Controller{
		Sign:  newSignController(templater, repository, config),
		OAuth: newOAuthController(oauthServer, repository),
	}
}
