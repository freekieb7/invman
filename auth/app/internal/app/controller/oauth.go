package controller

import (
	"encoding/json"
	"fmt"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/session"
	oauth2Server "invman/auth/internal/pkg/oauth2/server"
	"net/http"
	"net/url"

	"github.com/google/uuid"
)

type oAuthController struct {
	oauth2Server *oauth2Server.Server
	repository   *repository.Repository
}

func newOAuthController(oauth2Server *oauth2Server.Server, repository *repository.Repository) *oAuthController {
	return &oAuthController{
		oauth2Server: oauth2Server,
		repository:   repository,
	}
}

func (controller *oAuthController) HandleAuthorize(response http.ResponseWriter, request *http.Request) {
	var form url.Values

	session := session.From(request)

	if returnUri, ok := session.GetReturnURI(); ok {
		form = returnUri
	}
	request.Form = form
	session.DeleteReturnURI()

	controller.oauth2Server.HandleAuthorizeRequest(response, request)
}

func (controller *oAuthController) HandleToken(response http.ResponseWriter, request *http.Request) {
	controller.oauth2Server.HandleTokenRequest(response, request)
}

func (controller *oAuthController) GetMe(response http.ResponseWriter, request *http.Request) {
	tokenInfo, err := controller.oauth2Server.ValidateAndGetTokenInfo(request)

	if err != nil {
		response.WriteHeader(http.StatusForbidden)
		return
	}

	uuid := uuid.MustParse(tokenInfo.GetUserID())
	account, err := controller.repository.Account.Get(uuid)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(response).Encode(map[string]any{
		"id":       account.UUID.String(),
		"username": account.Username,
		"email":    account.Email,
		"imageUrl": fmt.Sprintf("https://ui-avatars.com/api/?background=random&name=%s&format=png", account.Username),
	}); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Something went wrong"))
	}

	response.Header().Set("Content-Type", "application/json")
}
