package controller

import (
	"encoding/json"
	"invman/auth/pkg/app/http/render"
	"invman/auth/pkg/app/http/session"
	"invman/auth/pkg/app/repository"
	"invman/auth/pkg/oauth2"
	"log"
	"net/http"
	"net/url"

	"github.com/google/uuid"
)

type OAuthController struct {
	oauth2Service     *oauth2.Service
	accountRepository *repository.AccountRepository
}

func NewOAuthController(oauth2Service *oauth2.Service, accountRepository *repository.AccountRepository) *OAuthController {
	return &OAuthController{
		oauth2Service:     oauth2Service,
		accountRepository: accountRepository,
	}
}

func (controller *OAuthController) HandleAuthorize(response http.ResponseWriter, request *http.Request) {
	session := session.From(request)

	var form url.Values
	if v, ok := session.GetReturnURI(); ok {
		form = v
	}
	request.Form = form

	session.DeleteReturnURI()

	err := controller.oauth2Service.HandleAuthorize(response, request)

	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
	}
}

func (controller *OAuthController) HandleToken(response http.ResponseWriter, request *http.Request) {
	err := controller.oauth2Service.HandleToken(response, request)

	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
	}
}

func (controller *OAuthController) GetMe(response http.ResponseWriter, request *http.Request) {
	bearerToken, err := controller.oauth2Service.BearerTokenValidation(request)

	if err != nil {
		log.Print(err)

		render.ErrForbidden(response, err)
		return
	}

	account, err := controller.accountRepository.Get(
		uuid.MustParse(bearerToken.GetUserID()),
	)

	if err != nil {
		log.Print(err)

		render.ErrForbidden(response, nil)
		return
	}

	if err := json.NewEncoder(response).Encode(map[string]any{
		"id":        account.ID.String(),
		"companyId": account.CompanyID,
		"firstname": account.Firstname,
		"lastname":  account.Lastname,
		"email":     account.Email,
		"imageUrl":  nil,
	}); err != nil {
		render.ErrInternalServerError(response, nil)
	}
}
