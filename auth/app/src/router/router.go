package router

import (
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"net/url"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-session/session"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"invman.com/oauth/src/database/entity"
)

type H map[string]any

const (
	StaticFilesPath    = "/static"
	HealthPath         = "/health"
	MetricsPath        = "/metrics"
	RegisterPath       = "/register"
	SigninPath         = "/signin"
	AuthPath           = "/auth"
	OAuthAuthorizePath = "/oauth/authorize"
	OAuthTokenPath     = "/oauth/token"
	OAuthMePath        = "/oauth/me"
)

func New(db *gorm.DB, server *server.Server) *chi.Mux {
	router := chi.NewRouter()

	// Middleware stack
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all
		AllowedHeaders:   []string{"authorization", "content-type"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowCredentials: true,
	}).Handler)

	// Template server
	fileServer := http.FileServer(http.Dir("/public/static"))
	tmpl, err := template.ParseGlob("template/*")

	if err != nil {
		panic(err)
	}

	// Public routes TODO protect
	router.Group(func(router chi.Router) {
		router.Get(HealthPath, func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("Healthy"))
		})

		router.Get(MetricsPath, promhttp.Handler().ServeHTTP)
	})

	// Authentication routes
	router.Group(func(router chi.Router) {

		router.Get(StaticFilesPath, func(w http.ResponseWriter, r *http.Request) {
			_, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Something went wrong"))
				return
			}

			fileServer.ServeHTTP(w, r)
		})

		router.Get(RegisterPath, func(w http.ResponseWriter, r *http.Request) {
			_, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			tmpl.ExecuteTemplate(w, "register.tmpl", nil)
		})

		router.Post(RegisterPath, func(w http.ResponseWriter, r *http.Request) {
			_, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			// Validate form
			email := r.PostFormValue("email")
			password := r.PostFormValue("password")
			nickname := r.PostFormValue("nickname")

			if len(email) > 100 || len(email) < 6 || len(password) > 50 || len(password) < 6 || len(nickname) > 25 || len(nickname) < 3 {
				w.WriteHeader(http.StatusBadRequest)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Length requirements not met",
				})
				return
			}

			// Hash password
			passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			// Store new account
			dbErr := db.Create(&entity.Account{
				Email:    email,
				Nickname: nickname,
				Password: string(passwordHash),
			}).Error

			if dbErr != nil {
				if errors.Is(dbErr, gorm.ErrDuplicatedKey) {
					w.WriteHeader(http.StatusConflict)
					tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
						"Error": "Email is already in use",
					})
				} else {
					w.WriteHeader(http.StatusInternalServerError)
					tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
						"Error": "Unable to register account",
					})
				}

				return
			}

			// Redirect to login page
			w.Header().Add("Location", "/signin")
			w.WriteHeader(http.StatusFound)
		})

		router.Get(SigninPath, func(w http.ResponseWriter, r *http.Request) {
			_, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			tmpl.ExecuteTemplate(w, "sign_in.tmpl", nil)
		})

		router.Post(SigninPath, func(w http.ResponseWriter, r *http.Request) {
			store, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			// Get Form values
			email := r.PostFormValue("email")
			password := r.PostFormValue("password")

			if len(email) > 100 || len(email) < 6 || len(password) > 50 || len(password) < 6 {
				w.WriteHeader(http.StatusBadRequest)
				tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
					"Error": "Length requirements not met",
				})
				return
			}

			// Account exists?
			var account = entity.Account{}
			dbErr := db.Where("email = ?", email).First(&account).Error

			if dbErr != nil {
				if errors.Is(dbErr, gorm.ErrRecordNotFound) {
					w.WriteHeader(http.StatusBadRequest)
					tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
						"Error": "Credentials are incorrect",
					})
				} else {
					w.WriteHeader(http.StatusInternalServerError)
					tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
						"Error": "Something went wrong",
					})
				}

				return
			}

			// Validate password
			if bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)) != nil {
				w.WriteHeader(http.StatusForbidden)
				tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
					"Error": "Credentials are incorrect",
				})
				return
			}

			// Save userID in session as logged in
			store.Set("LoggedInUserID", account.UUID.String())
			store.Save()

			// Redirect to authentication page
			w.Header().Add("Location", "/auth")
			w.WriteHeader(http.StatusFound)
		})

		router.Get(AuthPath, func(w http.ResponseWriter, r *http.Request) {
			_, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "sign_in.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			tmpl.ExecuteTemplate(w, "auth.tmpl", nil)
		})

		router.Post(AuthPath, func(w http.ResponseWriter, r *http.Request) {
			store, err := session.Start(r.Context(), w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "login.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			// Check if user is authenticated to continue
			if _, ok := store.Get("LoggedInUserID"); !ok {
				w.WriteHeader(http.StatusFound)
				w.Header().Add("Location", "/signin")
				return
			}

			// Go back to authentication page
			tmpl.ExecuteTemplate(w, "auth.tmpl", nil)
		})

		router.Route(OAuthAuthorizePath, func(router chi.Router) {
			requestHandler := func(w http.ResponseWriter, r *http.Request) {
				store, err := session.Start(r.Context(), w, r)

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte("Something went wrong"))
					return
				}

				if r.Form == nil {
					r.ParseForm()
				}

				var form url.Values
				if v, ok := store.Get("ReturnUri"); ok {
					form = v.(url.Values)

					// Save for when handling user authorization
					form.Set("allowAccess", r.Form.Get("allowAccess"))
				}

				r.Form = form

				store.Delete("ReturnUri")
				store.Save()

				err = server.HandleAuthorizeRequest(w, r)

				if err != nil {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("Bad request"))
					return
				}
			}

			router.Get("/", requestHandler)
			router.Post("/", requestHandler)
		})

		router.Post(OAuthTokenPath, func(w http.ResponseWriter, r *http.Request) {
			err := server.HandleTokenRequest(w, r)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Something went wrong"))
				return
			}

			// type StandardClaims struct {
			// 	Audience  string `json:"aud,omitempty"`
			// 	ExpiresAt int64  `json:"exp,omitempty"`
			// 	Id        string `json:"jti,omitempty"`
			// 	IssuedAt  int64  `json:"iat,omitempty"`
			// 	Issuer    string `json:"iss,omitempty"`
			// 	NotBefore int64  `json:"nbf,omitempty"`
			// 	Subject   string `json:"sub,omitempty"`
			// }
		})

		router.Get(OAuthMePath, func(w http.ResponseWriter, r *http.Request) {
			token, err := server.ValidationBearerToken(r)

			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("Bad request"))
				return
			}

			// Account exist?
			var account entity.Account
			dbErr := db.Where("uuid = ?", token.GetUserID()).First(&account).Error

			if dbErr != nil {
				if errors.Is(gorm.ErrRecordNotFound, dbErr) {
					w.WriteHeader(http.StatusNotFound)
					w.Write([]byte("Account not found"))
				} else {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte("Something went wrong"))
				}

				return
			}

			// Account info
			if err := json.NewEncoder(w).Encode(map[string]any{
				"id":       account.UUID.String(),
				"nickname": account.Nickname,
				"email":    account.Email,
				"imageUrl": fmt.Sprintf("https://ui-avatars.com/api/?background=random&name=%s&format=png", account.Nickname),
			}); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("Something went wrong"))
			}

			w.Header().Set("Content-Type", "application/json")
		})

	})

	return router
}
