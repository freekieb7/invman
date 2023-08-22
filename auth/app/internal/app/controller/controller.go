package controller

import (
	"html/template"
	"invman/auth/internal/app/repository"
	oauth2Server "invman/auth/internal/pkg/oauth2/server"
)

type Controller struct {
	Auth   *authController
	OAuth2 *oAuth2Controller
}

func New(templateServer *template.Template, oauth2Server *oauth2Server.Server, repository *repository.Repository) *Controller {
	return &Controller{
		Auth:   newAuthController(templateServer, repository),
		OAuth2: newOAuth2Controller(oauth2Server, repository),
	}
}
