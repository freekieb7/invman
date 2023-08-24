package server

import (
	"log"
	"net/http"

	"invman/auth/internal/app/config"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/session"

	"github.com/go-oauth2/oauth2/v4"
	"github.com/go-oauth2/oauth2/v4/errors"
	"github.com/go-oauth2/oauth2/v4/generates"
	"github.com/go-oauth2/oauth2/v4/manage"
	"github.com/go-oauth2/oauth2/v4/models"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-oauth2/oauth2/v4/store"
)

type Server struct {
	oauth2 *server.Server
}

func (srv *Server) HandleAuthorizeRequest(response http.ResponseWriter, request *http.Request) {
	err := srv.oauth2.HandleAuthorizeRequest(response, request)

	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
	}
}

func (srv *Server) HandleTokenRequest(response http.ResponseWriter, request *http.Request) {
	err := srv.oauth2.HandleTokenRequest(response, request)

	if err != nil {
		http.Error(response, err.Error(), http.StatusBadRequest)
	}
}

func (srv *Server) ValidateAndGetTokenInfo(request *http.Request) (tokenInfo oauth2.TokenInfo, err error) {
	return srv.oauth2.ValidationBearerToken(request)
}

func New(cnf *config.OAuthConfig, repository *repository.Repository) *Server {
	manager := manage.NewDefaultManager()
	// token memory store
	manager.MustTokenStorage(store.NewMemoryTokenStore())

	// client memory store
	clientStore := store.NewClientStore()
	clientStore.Set(cnf.ClientConfig.ClientId, &models.Client{
		ID:     cnf.ClientConfig.ClientId,
		Secret: cnf.ClientConfig.ClientSecret,
	})
	manager.MapClientStorage(clientStore)

	manager.MapAccessGenerate(generates.NewAccessGenerate())

	srv := server.NewDefaultServer(manager)

	// Handles logic for directing user through the authorization process
	srv.SetUserAuthorizationHandler(func(response http.ResponseWriter, request *http.Request) (userID string, err error) {
		session := session.From(request)

		sesUserID, idOk := session.GetUserID()
		sesGranted, grantedOk := session.GetAuthorizeGranted()

		log.Print(idOk, grantedOk, sesGranted)

		if !idOk {
			if request.Form == nil {
				request.ParseForm()
			}

			session.SetClientData(request.Form)

			http.Redirect(response, request, "/signin", http.StatusFound)
			return
		}

		userID = sesUserID.String()

		session.DeleteUserID()
		session.DeleteAuthorizeGranted()
		session.DeleteClientData()

		return
	})

	srv.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})

	srv.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	return &Server{
		oauth2: srv,
	}
}
