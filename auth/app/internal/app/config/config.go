package config

import (
	"invman/auth/internal/app/env"
)

type Config struct {
	Server ServerConfig
	Db     DbConfig
	OAuth  OAuthConfig
	Redis  RedisConfig
	Mail   MailConfig
}

type ServerConfig struct {
	Host       string
	Port       uint16
	PublicHost string
	AppHost    string
}

type DbConfig struct {
	Host     string
	Port     uint16
	User     string
	Password string
	Db       string
	SSL      SslMode
}

type MailConfig struct {
	Username string
	Password string
}

type OAuthConfig struct {
	ClientId     string
	ClientSecret string
}

type RedisConfig struct {
	Host     string
	Port     uint16
	Password string
	DbNumber uint8
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
		Redis:  DefaultRedisConfig,
		Mail:   DefaultMailConfig,
		OAuth:  DefaultOAuthConfig,
	}

	DefaultServerConfig = ServerConfig{
		Host:       "0.0.0.0",
		Port:       3000,
		PublicHost: "https://auth.invman.nl",
		AppHost:    "https://app.invman.nl",
	}

	DefaultDbConfig = DbConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "",
		Db:       "postgres",
		SSL:      Disable,
	}

	DefaultOAuthConfig = OAuthConfig{
		ClientId:     "123456",
		ClientSecret: "my_client_secret",
	}

	DefaultRedisConfig = RedisConfig{
		Host:     "localhost",
		Port:     6379,
		Password: "",
	}

	DefaultMailConfig = MailConfig{
		Username: "no-reply@invman.nl",
		Password: "",
	}
)

func New() Config {
	cfg := DefaultConfig

	cfg.Server.fromEnv()
	cfg.Db.fromEnv()
	cfg.Redis.fromEnv()
	cfg.OAuth.fromEnv()
	cfg.Mail.fromEnv()

	return cfg
}

func (cnf *ServerConfig) fromEnv() {
	cnf.Host = env.GetString("HOST", cnf.Host)
	cnf.Port = env.GetUint16("PORT", cnf.Port)
	cnf.PublicHost = env.GetString("PUBLIC_HOST", cnf.PublicHost)
	cnf.AppHost = env.GetString("APP_HOST", cnf.AppHost)
}

func (cnf *DbConfig) fromEnv() {
	cnf.Host = env.GetString("POSTGRES_HOST", cnf.Host)
	cnf.Port = env.GetUint16("POSTGRES_PORT", cnf.Port)
	cnf.User = env.GetString("POSTGRES_USER", cnf.User)
	cnf.Password = env.GetString("POSTGRES_PASSWORD", cnf.Password)
	cnf.Db = env.GetString("POSTGRES_DB", cnf.Db)
}

func (cnf *OAuthConfig) fromEnv() {
	cnf.ClientId = env.GetString("OAUTH_CLIENT_ID", cnf.ClientId)
	cnf.ClientSecret = env.GetString("OAUTH_CLIENT_SECRET", cnf.ClientSecret)
}

func (cnf *RedisConfig) fromEnv() {
	cnf.Host = env.GetString("REDIS_HOST", cnf.Host)
	cnf.DbNumber = env.GetUint8("REDIS_NR", cnf.DbNumber)
	cnf.Port = env.GetUint16("REDIS_PORT", cnf.Port)
	cnf.Password = env.GetString("REDIS_PASSWORD", cnf.Password)
}

func (cnf *MailConfig) fromEnv() {
	cnf.Username = env.GetString("MAIL_USERNAME", cnf.Username)
	cnf.Password = env.GetString("MAIL_PASSWORD", cnf.Password)
}
