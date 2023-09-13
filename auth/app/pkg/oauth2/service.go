package oauth2

import (
	"fmt"
	"log"
	"net/http"

	"invman/auth/internal/app/config"
	"invman/auth/pkg/app/http/session"

	oredis "github.com/go-oauth2/redis/v4"
	"github.com/go-redis/redis/v8"

	"github.com/go-oauth2/oauth2/v4/errors"
	"github.com/go-oauth2/oauth2/v4/generates"
	"github.com/go-oauth2/oauth2/v4/manage"
	"github.com/go-oauth2/oauth2/v4/models"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-oauth2/oauth2/v4/store"
)

type Service struct {
	oauth2Server *server.Server
}

func New(oAuthConfig config.OAuthConfig, redisConfig config.RedisConfig) *Service {
	serverManager := newServerManager(oAuthConfig, redisConfig)
	server := server.NewDefaultServer(serverManager)

	/// Handles logic for directing user through the authorization process
	server.SetUserAuthorizationHandler(func(response http.ResponseWriter, request *http.Request) (userID string, err error) {
		session := session.From(request)

		id, ok := session.GetUserID()

		if !ok {
			if request.Form == nil {
				request.ParseForm()
			}

			session.SetReturnURI(request.Form)

			http.Redirect(response, request, "/", http.StatusFound)
			return
		}

		userID = id.String()

		session.DeleteUserID()

		return
	})

	server.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})

	server.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	return &Service{
		oauth2Server: server,
	}
}

func newServerManager(oAuthConfig config.OAuthConfig, redisConfig config.RedisConfig) *manage.Manager {
	manager := manage.NewDefaultManager()

	// Token storage
	manager.MapTokenStorage(oredis.NewRedisStore(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisConfig.Host, redisConfig.Port),
		DB:       int(redisConfig.DbNumber),
		Password: redisConfig.Password,
	}))

	// Client info
	clientStore := store.NewClientStore()
	clientStore.Set(oAuthConfig.ClientId, &models.Client{
		ID:     oAuthConfig.ClientId,
		Secret: oAuthConfig.ClientSecret,
	})
	manager.MapClientStorage(clientStore)

	// Access token
	manager.MapAccessGenerate(generates.NewAccessGenerate())

	return manager
}

func (service *Service) HandleAuthorize(response http.ResponseWriter, request *http.Request) error {
	return service.oauth2Server.HandleAuthorizeRequest(response, request)
}

func (service *Service) HandleToken(response http.ResponseWriter, request *http.Request) error {
	return service.oauth2Server.HandleTokenRequest(response, request)
}

func (service *Service) BearerTokenValidation(request *http.Request) (*BearerToken, error) {
	tokenInfo, err := service.oauth2Server.ValidationBearerToken(request)

	if err != nil {
		return nil, err
	}

	return &BearerToken{
		info: tokenInfo,
	}, nil
}
