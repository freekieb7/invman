package oauth2

import "github.com/go-oauth2/oauth2/v4"

type BearerToken struct {
	info oauth2.TokenInfo
}

func (token *BearerToken) GetUserID() string {
	return token.info.GetUserID()
}
