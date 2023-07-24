package auth

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/jwtauth/v5"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type contextKey string

const (
	userIdCtxKey contextKey = "userID"
)

// Verifies the access token provided in the request
func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")
			authorizationHeaderSplit := strings.Split(authorizationHeader, "Bearer ")

			if len(authorizationHeaderSplit) < 2 {
				http.Error(w, "Must provide Authorization header with format `Bearer {token}`", http.StatusBadRequest)
				return
			}

			accessTokenUnvalidated := authorizationHeaderSplit[1]

			// validate ID token here
			tokenSecret := os.Getenv("ACCESS_TOKEN_SECRET")
			accessToken, err := jwt.Parse(accessTokenUnvalidated, func(token *jwt.Token) (interface{}, error) {
				return []byte(tokenSecret), nil
			})

			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			claims := accessToken.Claims.(jwt.MapClaims)
			userID, err := uuid.Parse(claims["sub"].(string))

			if err != nil {
				http.Error(w, "Token contains invalid uuid", http.StatusBadRequest)
				return
			}

			ctx := context.WithValue(r.Context(), userIdCtxKey, userID)

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func UserId(ctx context.Context) uuid.UUID {
	_, claims, _ := jwtauth.FromContext(ctx)
	id, _ := uuid.Parse(claims["sub"].(string))

	return id
}
