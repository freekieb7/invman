package middleware

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-session/session"
)

type key string

const (
	SessionStoreCtxKey key = "store"
)

func SessionHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		store, err := session.Start(request.Context(), response, request)

		if err != nil {
			response.WriteHeader(http.StatusBadRequest)
		}

		ctx := context.WithValue(request.Context(), SessionStoreCtxKey, store)
		next.ServeHTTP(response, request.WithContext(ctx))
	})
}

// Write request handling result to access.log
func AccessLogger(next http.Handler) http.Handler {
	// TODO add log rotation logic (with go routine?)

	file, err := os.OpenFile("log/access.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)

	if err != nil {
		log.Fatal(err)
	}

	fn := func(w http.ResponseWriter, r *http.Request) {
		// Reuse chi middleware logger for clean format
		formatter := &chiMiddleware.DefaultLogFormatter{Logger: log.New(file, "", log.LstdFlags), NoColor: true}
		logEntry := formatter.NewLogEntry(r)
		wWithStats := chiMiddleware.NewWrapResponseWriter(w, r.ProtoMajor)
		now := time.Now()

		defer func() {
			logEntry.Write(wWithStats.Status(), wWithStats.BytesWritten(), wWithStats.Header(), time.Since(now), nil)
		}()

		next.ServeHTTP(wWithStats, chiMiddleware.WithLogEntry(r, logEntry))
	}

	return http.HandlerFunc(fn)
}
