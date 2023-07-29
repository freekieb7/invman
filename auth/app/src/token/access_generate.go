package token

import (
	"context"
	"encoding/base64"
	"strings"

	"github.com/go-oauth2/oauth2/v4"
	"github.com/go-oauth2/oauth2/v4/generates"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/oauth/src/database/entity"
)

type CustomJWTAccessGenerate struct {
	db     *gorm.DB
	issuer string
	*generates.JWTAccessGenerate
}

func NewJWTAccessGenerate(db *gorm.DB, issuer string, accessTokenSecret string) *CustomJWTAccessGenerate {
	return &CustomJWTAccessGenerate{
		db,
		issuer,
		generates.NewJWTAccessGenerate("", []byte(accessTokenSecret), jwt.SigningMethodHS512),
	}
}

// Override default method to allow custom access token claims
func (a *CustomJWTAccessGenerate) Token(ctx context.Context, data *oauth2.GenerateBasic, isGenRefresh bool) (string, string, error) {
	account := entity.Account{UUID: uuid.MustParse(data.UserID)}

	err := a.db.First(&account).Error

	if err != nil {
		return "", "", err
	}

	claims := &jwt.MapClaims{
		"aud": data.Client.GetID(),
		"sub": data.UserID,
		"exp": data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
		"iat": data.CreateAt.Unix(),
		"iss": a.issuer,
		"nbf": data.CreateAt.Unix(),
		"gid": account.GroupId.String(),
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
