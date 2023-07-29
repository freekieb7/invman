package server

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-oauth2/oauth2/v4/errors"
	"github.com/go-oauth2/oauth2/v4/manage"
	"github.com/go-oauth2/oauth2/v4/models"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-oauth2/oauth2/v4/store"
	"github.com/go-session/session"
	"gorm.io/gorm"
	"invman.com/oauth/src/config"
	"invman.com/oauth/src/database/entity"
	"invman.com/oauth/src/token"

	"golang.org/x/crypto/bcrypt"

	oredis "github.com/go-oauth2/redis/v4"
	"github.com/go-redis/redis/v8"
)

func New(cnf *config.OAuthConfig, db *gorm.DB) *server.Server {
	// Step 1: Config server manager
	manager := manage.NewDefaultManager()

	/// Token store config
	manager.MapTokenStorage(oredis.NewRedisStore(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cnf.TokenStorageConfig.Host, cnf.TokenStorageConfig.Port),
		DB:       int(cnf.TokenStorageConfig.DbNumber),
		Password: cnf.TokenStorageConfig.Password,
	}))

	/// JWT access token config
	manager.MapAccessGenerate(token.NewJWTAccessGenerate(cnf.TokenConfig.Issuer, cnf.TokenConfig.AccessTokenSecret))

	// Client config
	clientStore := store.NewClientStore()
	clientStore.Set(cnf.ClientConfig.ClientId, &models.Client{
		ID:     cnf.ClientConfig.ClientId,
		Secret: cnf.ClientConfig.ClientSecret,
	})
	manager.MapClientStorage(clientStore)

	// Step 2: Config server
	srv := server.NewServer(server.NewConfig(), manager)

	srv.SetPasswordAuthorizationHandler(func(ctx context.Context, clientID, email, password string) (userID string, err error) {
		// Compare provided password with stored password
		var account = entity.Account{Email: email}
		dbErr := db.First(account).Error

		if dbErr != nil {
			return
		}

		if cmpPassErr := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)); cmpPassErr != nil {
			return
		}

		// Set validated user ID for processing the request
		userID = account.UUID.String()
		return
	})

	srv.SetUserAuthorizationHandler(func(w http.ResponseWriter, r *http.Request) (userID string, err error) {
		store, err := session.Start(r.Context(), w, r)

		if err != nil {
			return
		}

		// Set validated user ID from session to request context
		uid, ok := store.Get("LoggedInUserID")

		if r.Form == nil {
			r.ParseForm()
		}

		if !ok {
			store.Set("ReturnUri", r.Form)
			store.Save()

			w.Header().Set("Location", "/signin")
			w.WriteHeader(http.StatusFound)
			return
		}

		userID = uid.(string)

		// Clean session
		store.Delete("LoggedInUserID")
		store.Save()

		log.Print(r.Form)

		// Check if user has given permission
		if r.FormValue("allowAccess") != "yes" {
			err = errors.ErrAccessDenied
			return
		}

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
