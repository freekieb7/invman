package token

import (
	"context"
	"encoding/base64"
	"strings"

	"github.com/go-oauth2/oauth2/v4"
	"github.com/go-oauth2/oauth2/v4/generates"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type CustomClaims struct {
	jwt.StandardClaims
}

func (c CustomClaims) Valid() error {
	return c.StandardClaims.Valid()
}

func NewJWTAccessGenerate(issuer string, accessTokenSecret string) *CustomJWTAccessGenerate {
	return &CustomJWTAccessGenerate{
		issuer,
		generates.NewJWTAccessGenerate("", []byte(accessTokenSecret), jwt.SigningMethodHS512),
	}
}

type CustomJWTAccessGenerate struct {
	issuer string
	*generates.JWTAccessGenerate
}

// Override default method to allow custom access token claims
func (a *CustomJWTAccessGenerate) Token(ctx context.Context, data *oauth2.GenerateBasic, isGenRefresh bool) (string, string, error) {
	claims := &generates.JWTAccessClaims{
		StandardClaims: jwt.StandardClaims{
			Audience:  data.Client.GetID(),
			Subject:   data.UserID,
			ExpiresAt: data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
			IssuedAt:  data.CreateAt.Unix(),
			Issuer:    a.issuer,
			NotBefore: data.CreateAt.Unix(),
		},
	}

	token := jwt.NewWithClaims(a.SignedMethod, claims)
	if a.SignedKeyID != "" {
		token.Header["kid"] = a.SignedKeyID
	}
	key := a.SignedKey

	access, err := token.SignedString(key)
	if err != nil {
		return "", "", err
	}
	refresh := ""

	if isGenRefresh {
		t := uuid.NewSHA1(uuid.Must(uuid.NewRandom()), []byte(access)).String()
		refresh = base64.URLEncoding.EncodeToString([]byte(t))
		refresh = strings.ToUpper(strings.TrimRight(refresh, "="))
	}

	return access, refresh, nil
}
