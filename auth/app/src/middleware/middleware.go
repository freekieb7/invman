package middleware

import (
	"log"
	"net/http"
	"os"
	"time"

	chiMiddleware "github.com/go-chi/chi/v5/middleware"
)

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
