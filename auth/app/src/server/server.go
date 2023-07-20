package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-oauth2/oauth2/v4/errors"
	"github.com/go-oauth2/oauth2/v4/generates"
	"github.com/go-oauth2/oauth2/v4/manage"
	"github.com/go-oauth2/oauth2/v4/models"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-oauth2/oauth2/v4/store"
	"github.com/go-session/session"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
	"invman.com/oauth/src/infra/database/entity"

	"golang.org/x/crypto/bcrypt"

	oredis "github.com/go-oauth2/redis/v4"
	"github.com/go-redis/redis/v8"
)

func New(db *gorm.DB) *server.Server {
	RedisHost := os.Getenv("REDIS_HOST")
	RedisPassword := os.Getenv("REDIS_PASSWORD")
	RedisPort, _ := strconv.Atoi(os.Getenv("REDIS_PORT"))

	ClientID := os.Getenv("OAUTH_CLIENT_ID")
	ClientSecret := os.Getenv("OAUTH_CLIENT_SECRET")
	TokenSecret := os.Getenv("API_ACCESS_TOKEN_SECRET")

	manager := manage.NewDefaultManager()
	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)

	// token store
	manager.MapTokenStorage(oredis.NewRedisStore(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", RedisHost, RedisPort),
		DB:       0,
		Password: RedisPassword,
	}))

	// generate jwt access token
	manager.MapAccessGenerate(generates.NewJWTAccessGenerate("", []byte(TokenSecret), jwt.SigningMethodHS512))

	clientStore := store.NewClientStore()
	clientStore.Set(ClientID, &models.Client{
		ID:     ClientID,
		Secret: ClientSecret,
	})
	manager.MapClientStorage(clientStore)

	srv := server.NewServer(server.NewConfig(), manager)

	srv.SetPasswordAuthorizationHandler(func(ctx context.Context, clientID, email, password string) (userID string, err error) {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		var account = entity.Account{Email: email, Password: string(hashedPassword)}
		errs := db.First(account).Error

		if errs != nil {
			return
		}

		userID = account.UUID.String()
		return
	})

	srv.SetUserAuthorizationHandler(func(w http.ResponseWriter, r *http.Request) (userID string, err error) {
		store, err := session.Start(r.Context(), w, r)
		if err != nil {
			return
		}

		uid, ok := store.Get("LoggedInUserID")
		if !ok {
			if r.Form == nil {
				r.ParseForm()
			}

			store.Set("ReturnUri", r.Form)
			store.Save()

			w.Header().Set("Location", "/login")
			w.WriteHeader(http.StatusFound)
			return
		}

		userID = uid.(string)
		store.Delete("LoggedInUserID")
		store.Save()
		return
	})

	srv.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})

	srv.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	return srv
}
