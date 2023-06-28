package router

import (
	"net/http"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-oauth2/oauth2/v4/server"
	"github.com/go-session/session"
)

const (
	LoginPath          = "/login"
	AuthPath           = "/auth"
	OAuthAuthorizePath = "/oauth/authorize"
	OAuthTokenPath     = "/oauth/token"
	OAuthMePath        = "/oauth/me"
)

// New creates route endpoint
func New(server *server.Server) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST"},
	}))

	router.LoadHTMLGlob("templates/*")

	router.GET(LoginPath, func(c *gin.Context) {
		_, err := session.Start(c, c.Writer, c.Request)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal",
			})
			return
		}

		c.HTML(http.StatusOK, "login.html", nil)
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

		store.Set("LoggedInUserID", c.Request.Form.Get("username"))
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
			// form.Set("redirect_uri", "host.docker.internal")
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
		c.JSON(200, gin.H{
			"id":            "80351110224678912",
			"username":      "Nelly",
			"discriminator": "1337",
			"avatar":        "8342729096ea3675442027381ff50dfe",
			"verified":      true,
			"email":         "nelly@discord.com",
			"flags":         64,
			"banner":        "06c16474723fe537c283b8efa61a30c8",
			"accent_color":  16711680,
			"premium_type":  1,
			"public_flags":  64,
			"image_url":     "https://www.redditstatic.com/shreddit/assets/favicon/192x192.png",
		})
	})

	return router
}
