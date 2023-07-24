FROM golang:alpine

WORKDIR /app

RUN apk add curl

RUN go install github.com/cosmtrek/air@latest

COPY go.mod go.sum ./
RUN go mod download

CMD ["air", "-c", ".air.dev.toml"]