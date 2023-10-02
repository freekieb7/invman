package authentication

import (
	"context"
	"encoding/json"
	"fmt"
	"invman/api/pkg/app/database"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var companyIdCtxKey = &contextKey{"companyId"}

type contextKey struct {
	name string
}

// A stand-in for our database backed user object
type User struct {
	CompanyId uuid.UUID
}

// Middleware decodes the share session cookie and packs the session into context
func Middleware(database database.Database) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")

			if authorizationHeader == "" {
				authorizationHeader = r.Header.Get("authorization")
			}

			if authorizationHeader == "" {
				http.Error(w, "Invalid token", http.StatusBadRequest)
				return
			}

			authorizationHeaderSplit := strings.Split(authorizationHeader, " ")

			if len(authorizationHeaderSplit) < 2 {
				http.Error(w, "Invalid token", http.StatusBadRequest)
				return
			}

			req, err := http.NewRequest("GET", "http://auth:8080/oauth/me", nil)

			if err != nil {
				log.Panic(err)
			}

			req.Header.Add("Authorization", authorizationHeader)

			c := http.Client{}

			res, err := c.Do(req)

			if err != nil {
				log.Panic(err)
			}

			if res.StatusCode != http.StatusOK {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			var content map[string]interface{}
			json.NewDecoder(res.Body).Decode(&content)

			if err != nil {
				http.Error(w, "Server error", http.StatusInternalServerError)
				return
			}

			user := User{
				CompanyId: uuid.MustParse(content["companyId"].(string)),
			}

			// put it in context
			ctx := context.WithValue(r.Context(), companyIdCtxKey, &user)

			// Set correct search path
			database.Exec(fmt.Sprintf(`SET search_path TO "%s";`, user.CompanyId.String()))

			// and call the next with our new context
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *User {
	raw, _ := ctx.Value(companyIdCtxKey).(*User)
	return raw
}
