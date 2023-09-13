FROM golang:alpine

WORKDIR /app

# Add support for healhcheck test
RUN apk add curl

# Creates an app directory to hold your app’s source code
WORKDIR /app

# Install Air for hot reloading
RUN go install github.com/cosmtrek/air@latest

CMD ["air", "-c", "internal/air/config/.air.dev.toml"]