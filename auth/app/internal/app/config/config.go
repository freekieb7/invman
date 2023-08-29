package config

import (
	"invman/auth/internal/app/env"
)

type Config struct {
	Server ServerConfig
	Db     DbConfig
	Auth   AuthConfig
}

type ServerConfig struct {
	Host         string
	Port         uint16
	ExternalHost string
}

type DbConfig struct {
	Host     string
	Port     uint16
	User     string
	Password string
	Db       string
	SSL      SslMode
}

type AuthConfig struct {
	Redis  RedisConfig
	Client OAuthClientConfig
}

type RedisConfig struct {
	Host     string
	Port     uint16
	Password string
	DbNumber uint8
}

type OAuthClientConfig struct {
	ClientId     string
	ClientSecret string
}

// https://jdbc.postgresql.org/documentation/ssl/
type SslMode = string

const (
	Disable    SslMode = "disable"
	Allow      SslMode = "allow"
	Prefer     SslMode = "prefer"
	Require    SslMode = "require"
	VerifyCa   SslMode = "verify-ca"
	VerifyFull SslMode = "verifyFull"
)

var (
	DefaultConfig = Config{
		Server: DefaultServerConfig,
		Db:     DefaultDbConfig,
		Auth:   DefaultAuthConfig,
	}

	DefaultServerConfig = ServerConfig{
		Host:         "0.0.0.0",
		Port:         3000,
		ExternalHost: "https://auth.invman.nl",
	}

	DefaultDbConfig = DbConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "",
		Db:       "postgres",
		SSL:      Disable,
	}

	DefaultAuthConfig = AuthConfig{
		Redis:  DefaultRedisConfig,
		Client: DefaultClientConfig,
	}

	DefaultClientConfig = OAuthClientConfig{
		ClientId:     "123456",
		ClientSecret: "my_client_secret",
	}

	DefaultRedisConfig = RedisConfig{
		Host:     "localhost",
		Port:     6379,
		Password: "",
	}
)

func Load() (*Config, error) {
	cfg := DefaultConfig

	cfg.Server.fromEnv()
	cfg.Db.fromEnv()

	cfg.Auth.Client.fromEnv()
	cfg.Auth.Redis.fromEnv()

	return &cfg, nil
}

func (cnf *ServerConfig) fromEnv() {
	cnf.Host = env.GetString("HOST", cnf.Host)
	cnf.Port = env.GetUint16("PORT", cnf.Port)
	cnf.ExternalHost = env.GetString("EXTERNAL_HOST", cnf.ExternalHost)
}

func (cnf *DbConfig) fromEnv() {
	cnf.Host = env.GetString("POSTGRES_HOST", cnf.Host)
	cnf.Port = env.GetUint16("POSTGRES_PORT", cnf.Port)
	cnf.User = env.GetString("POSTGRES_USER", cnf.User)
	cnf.Password = env.GetString("POSTGRES_PASSWORD", cnf.Password)
	cnf.Db = env.GetString("POSTGRES_DB", cnf.Db)
}

func (cnf *OAuthClientConfig) fromEnv() {
	cnf.ClientId = env.GetString("OAUTH_CLIENT_ID", cnf.ClientId)
	cnf.ClientSecret = env.GetString("OAUTH_CLIENT_SECRET", cnf.ClientSecret)
}

func (cnf *RedisConfig) fromEnv() {
	cnf.Host = env.GetString("REDIS_HOST", cnf.Host)
	cnf.DbNumber = env.GetUint8("REDIS_NR", cnf.DbNumber)
	cnf.Port = env.GetUint16("REDIS_PORT", cnf.Port)
	cnf.Password = env.GetString("REDIS_PASSWORD", cnf.Password)
}
