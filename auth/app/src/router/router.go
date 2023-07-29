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
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-session/session"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"invman.com/oauth/src/database/entity"
	"invman.com/oauth/src/middleware"
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
	router.Use(chiMiddleware.RequestID)
	router.Use(chiMiddleware.RealIP)
	router.Use(middleware.AccessLogger) // Log to file
	router.Use(chiMiddleware.Logger)    // Log to console
	router.Use(chiMiddleware.Recoverer)
	router.Use(chiMiddleware.Timeout(60 * time.Second))

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
			groupName := r.PostFormValue("group_name")
			adminEmail := r.PostFormValue("admin_email")
			adminPassword := r.PostFormValue("admin_password")
			adminNickname := r.PostFormValue("admin_nickname")

			if len(groupName) > 50 || len(groupName) < 3 ||
				len(adminEmail) > 100 || len(adminEmail) < 6 ||
				len(adminPassword) > 50 || len(adminPassword) < 6 ||
				len(adminNickname) > 25 || len(adminNickname) < 3 {
				w.WriteHeader(http.StatusBadRequest)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Length requirements not met",
				})
				return
			}

			// Hash password
			passwordHash, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				tmpl.ExecuteTemplate(w, "register.tmpl", map[string]any{
					"Error": "Something went wrong",
				})
				return
			}

			// Store new group & account
			if err := db.Transaction(func(tx *gorm.DB) error {
				newGroup := entity.Group{
					Name: groupName,
				}

				if err := tx.Create(&newGroup).Error; err != nil {
					return err
				}

				newAccount := entity.Account{
					GroupId:  newGroup.UUID,
					Email:    adminEmail,
					Nickname: adminNickname,
					Password: string(passwordHash),
				}

				if err := tx.Create(&newAccount).Error; err != nil {
					return err
				}

				return nil
			}); err != nil {
				if errors.Is(err, gorm.ErrDuplicatedKey) {
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
