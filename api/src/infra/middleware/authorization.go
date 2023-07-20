package middleware

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt"
)

// IMPORTS OMITTED - Make sure to import validator/v10
// My auto import always uses V9

type SpecialClaims struct {
	Audience  string `json:"aud,omitempty"`
	ExpiresAt int64  `json:"exp,omitempty"`
	Subject   string `json:"sub,omitempty"`
}

type authHeader struct {
	BearerToken string `header:"Authorization" binding:"required"`
}

// used to help extract validation errors
type invalidArgument struct {
	Field string `json:"field"`
	Value string `json:"value"`
	Tag   string `json:"tag"`
	Param string `json:"param"`
}

// AuthUser extracts a user from the Authorization header
// which is of the form "Bearer token"
// It sets the user to the context if the user exists
func AuthUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		h := authHeader{}

		// bind Authorization Header to h and check for validation errors
		if err := c.ShouldBindHeader(&h); err != nil {
			if errs, ok := err.(validator.ValidationErrors); ok {
				// we used this type in bind_data to extract desired fields from errs
				// you might consider extracting it
				var invalidArgs []invalidArgument

				for _, err := range errs {
					invalidArgs = append(invalidArgs, invalidArgument{
						err.Field(),
						err.Value().(string),
						err.Tag(),
						err.Param(),
					})
				}

				c.JSON(http.StatusBadRequest, gin.H{
					"error":       "Invalid request parameters. See invalidArgs",
					"invalidArgs": invalidArgs,
				})
				c.Abort()
				return
			}

			// otherwise error type is unknown
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Internal error occurred",
			})
			c.Abort()
			return
		}

		idTokenHeader := strings.Split(h.BearerToken, "Bearer ")

		if len(idTokenHeader) < 2 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Must provide Authorization header with format `Bearer {token}`",
			})
			c.Abort()
			return
		}

		accessToken := idTokenHeader[1]

		// validate ID token here
		tokenSecret := os.Getenv("ACCESS_TOKEN_SECRET")
		token, err := jwt.Parse(accessToken, func(token *jwt.Token) (interface{}, error) {
			// since we only use the one private key to sign the tokens,
			// we also only use its public counter part to verify
			return []byte(tokenSecret), nil
		})

		if err != nil {
			c.AbortWithError(http.StatusForbidden, errors.New("provided token is invalid"))
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Set("userID", claims["sub"].(string))

		c.Next()
	}
}
