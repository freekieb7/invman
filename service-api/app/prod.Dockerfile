# Choose whatever you want, version >= 1.16
FROM golang:alpine

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest

COPY ./ ./
RUN go mod download

CMD ["air", "-c", ".air.prod.toml"]