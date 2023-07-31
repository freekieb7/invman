# Choose whatever you want, version >= 1.16
FROM golang:alpine

WORKDIR /app

RUN apk add curl

COPY src ./src
COPY graph ./graph
COPY cmd ./cmd

RUN go mod download

CMD ["go", "run", "cmd/main.go"]