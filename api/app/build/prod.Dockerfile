FROM golang:alpine

# Add support for healhcheck test
RUN apk add curl

# Creates an app directory to hold your app’s source code
WORKDIR /app

# Copies everything from your root directory into /app
COPY . .

# Installs Go dependencies
RUN go mod download

# Builds your app with optional configuration
RUN go build cmd/main.go

EXPOSE 8080

CMD ["./main"]