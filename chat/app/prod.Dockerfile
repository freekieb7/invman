FROM golang:alpine

WORKDIR /app

RUN apk add curl

COPY cmd ./cmd
COPY src ./src
COPY go.mod go.sum ./

RUN go mod download

CMD ["go", "run", "cmd/main.go"]