package router

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-session/session"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"invman.com/oauth/src/infra/database/entity"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

const (
	HealthPath         = "/health"
	MetricsPath        = "/metrics"
	RegisterPath       = "/register"
	LoginPath          = "/login"
	AuthPath           = "/auth"
	OAuthAuthorizePath = "/oauth/authorize"
	OAuthTokenPath     = "/oauth/token"
	OAuthMePath        = "/oauth/me"
)

// New creates route endpoint
func New(db *gorm.DB, server *server.Server) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods:    []string{"GET", "POST"},
	}))

	router.StaticFile("/favicon.ico", "./public/favicon.ico")
	router.LoadHTMLGlob("public/*")

	router.GET(HealthPath, func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"health": "Healthy!",
		})
		return
	})

	router.GET(MetricsPath, func(c *gin.Context) {
		promhttp.Handler().ServeHTTP(c.Writer, c.Request)
		return
	})

	router.POST(RegisterPath, func(c *gin.Context) {
		_, err := session.Start(c, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		if c.Request.Form == nil {
			if err := c.Request.ParseForm(); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "internal",
				})
				return
			}
		}

		email := c.Request.Form.Get("email")
		displayName := c.Request.Form.Get("display_name")
		password := c.Request.Form.Get("password")
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		db.Create(&entity.Account{
			Email:       email,
			DisplayName: displayName,
			Password:    string(hashedPassword),
		})

		c.JSON(http.StatusOK, gin.H{})
	})

	router.GET(LoginPath, func(c *gin.Context) {
		_, err := session.Start(c, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		c.HTML(http.StatusOK, "login.tmpl", nil)
	})

	router.POST(LoginPath, func(c *gin.Context) {
		store, err := session.Start(c, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		if c.Request.Form == nil {
			if err := c.Request.ParseForm(); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "internal",
				})
				return
			}
		}

		email := c.Request.Form.Get("email")
		password := c.Request.Form.Get("password")

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		var account = entity.Account{}
		errs := db.Where("email = ?", email).First(&account).Error

		if errs != nil {
			if errors.Is(errs, gorm.ErrRecordNotFound) {
				c.HTML(http.StatusOK, "login.tmpl", gin.H{
					"errorMsg": "Credentials are incorrect",
				})
			} else {
				c.HTML(http.StatusInternalServerError, "login.tmpl", gin.H{
					"errorMsg": "Something went wrong",
				})
			}

			return
		}

		if bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)) != nil {
			c.HTML(http.StatusOK, "login.tmpl", gin.H{
				"errorMsg": "Credentials are incorrect",
			})
			return
		}

		if errors.Is(errs, gorm.ErrRecordNotFound) {
			c.HTML(http.StatusOK, "login.tmpl", gin.H{
				"errorMsg": "Credentials are incorrect",
			})
		}

		store.Set("LoggedInUserID", account.UUID.String())
		store.Save()

		c.Redirect(http.StatusFound, "/auth")
	})

	router.GET(AuthPath, func(c *gin.Context) {
		_, err := session.Start(nil, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		c.HTML(200, "auth.html", nil)
	})

	router.POST(AuthPath, func(c *gin.Context) {
		store, err := session.Start(nil, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		if _, ok := store.Get("LoggedInUserID"); !ok {
			c.Redirect(http.StatusFound, "/login")
			return
		}

		c.HTML(200, "auth.html", nil)
	})

	router.GET(OAuthAuthorizePath, func(c *gin.Context) {
		store, err := session.Start(c.Request.Context(), c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		var form url.Values
		if v, ok := store.Get("ReturnUri"); ok {
			form = v.(url.Values)
		}
		c.Request.Form = form

		store.Delete("ReturnUri")
		store.Save()

		err = server.HandleAuthorizeRequest(c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Bad request",
			})
			return
		}
	})

	router.POST(OAuthAuthorizePath, func(c *gin.Context) {
		store, err := session.Start(c.Request.Context(), c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		var form url.Values
		if v, ok := store.Get("ReturnUri"); ok {
			form = v.(url.Values)
		}
		c.Request.Form = form

		store.Delete("ReturnUri")
		store.Save()

		err = server.HandleAuthorizeRequest(c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Bad request",
			})
			return
		}
	})

	router.POST(OAuthTokenPath, func(c *gin.Context) {
		err := server.HandleTokenRequest(c.Writer, c.Request)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}
	})

	router.GET(OAuthMePath, func(c *gin.Context) {
		token, err := server.ValidationBearerToken(c.Request)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Bad request",
			})
			return
		}

		var account entity.Account

		errs := db.Where("uuid = ?", token.GetUserID()).First(&account).Error

		if errs != nil {
			if errors.Is(gorm.ErrRecordNotFound, errs) {
				c.JSON(http.StatusNotFound, gin.H{
					"error": "user not found",
				})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "internal error",
				})
			}

			return
		}

		c.JSON(200, gin.H{
			"id":          account.UUID.String(),
			"displayName": account.DisplayName,
			"email":       account.Email,
			"imageUrl":    fmt.Sprintf("https://ui-avatars.com/api/?background=random&name=%s", account.DisplayName),
		})
	})

	return router
}
