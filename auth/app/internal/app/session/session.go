package session

import (
	"invman/auth/internal/app/middleware"
	"net/http"
	"net/url"

	"github.com/go-session/session"
	"github.com/google/uuid"
)

const (
	userIdKey    = "UserID"
	returnUriKey = "ReturnUri"
)

type Session struct {
	store session.Store
}

func Start(response http.ResponseWriter, request *http.Request) {
	_, err := session.Start(request.Context(), response, request)

	if err != nil {
		panic(err)
	}

}

func From(request *http.Request) *Session {
	store := request.Context().Value(middleware.SessionStoreCtxKey).(session.Store)

	return &Session{
		store: store,
	}
}

func (s *Session) GetUserID() (id uuid.UUID, ok bool) {
	val, ok := s.store.Get(userIdKey)

	if !ok {
		return id, false
	}

	return val.(uuid.UUID), true
}

func (s *Session) SetUserID(uuid uuid.UUID) error {
	s.store.Set(userIdKey, uuid)
	return s.store.Save()
}

func (s *Session) DeleteUserID() error {
	s.store.Delete(userIdKey)
	return s.store.Save()
}

func (s *Session) GetReturnURI() (data url.Values, ok bool) {
	val, ok := s.store.Get(returnUriKey)

	if !ok {
		return data, false
	}

	return val.(url.Values), true
}

func (s *Session) SetReturnURI(data url.Values) error {
	s.store.Set(returnUriKey, data)
	return s.store.Save()
}

func (s *Session) DeleteReturnURI() error {
	s.store.Delete(returnUriKey)
	return s.store.Save()
}
