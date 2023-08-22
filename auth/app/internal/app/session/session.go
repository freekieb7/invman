package session

import (
	"invman/auth/internal/app/middleware"
	"log"
	"net/http"
	"net/url"

	"github.com/go-session/session"
	"github.com/google/uuid"
)

const (
	userIDStoreKey     = "userID"
	grantedStoreKey    = "granted"
	clientDataStoreKey = "clientData"
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
	val, ok := s.store.Get(userIDStoreKey)

	if !ok {
		return id, false
	}

	return val.(uuid.UUID), true
}

func (s *Session) SetUserID(uuid uuid.UUID) error {
	s.store.Set(userIDStoreKey, uuid)
	return s.store.Save()
}

func (s *Session) DeleteUserID() error {
	s.store.Delete(userIDStoreKey)
	return s.store.Save()
}

func (s *Session) GetAuthorizeGranted() (granted bool, ok bool) {
	val, ok := s.store.Get(grantedStoreKey)

	if !ok {
		return granted, false
	}

	log.Fatal(val)

	return val.(bool), true
}

func (s *Session) SetAuthorizeGranted(granted bool) error {
	s.store.Set(grantedStoreKey, granted)
	return s.store.Save()
}

func (s *Session) DeleteAuthorizeGranted() error {
	s.store.Delete(grantedStoreKey)
	return s.store.Save()
}

func (s *Session) GetClientData() (data url.Values, ok bool) {
	val, ok := s.store.Get(clientDataStoreKey)

	if !ok {
		return data, false
	}

	return val.(url.Values), true
}

func (s *Session) SetClientData(data url.Values) error {
	s.store.Set(clientDataStoreKey, data)
	return s.store.Save()
}

func (s *Session) DeleteClientData() error {
	s.store.Delete(clientDataStoreKey)
	return s.store.Save()
}
