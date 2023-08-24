package config

import "invman/auth/internal/app/env"

type Config struct {
	DbConfig    DbConfig
	OAuthConfig OAuthConfig
}

type DbConfig struct {
	Host     string
	Port     uint16
	User     string
	Password string
	DbName   string
	SSL      SslMode
}

type OAuthConfig struct {
	TokenStorageConfig OAuthTokenStorageConfig
	ClientConfig       OAuthClientConfig
}

type OAuthTokenStorageConfig struct {
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
		DbConfig: DefaultDbConfig,
	}

	DefaultDbConfig = DbConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "",
		DbName:   "postgres",
		SSL:      Disable,
	}

	DefaultOauthClientConfig = OAuthClientConfig{
		ClientId:     "123456",
		ClientSecret: "my_client_secret",
	}

	DefaultOauthTokenStorageConfig = OAuthTokenStorageConfig{
		Host:     "localhost",
		Port:     6379,
		Password: "",
	}
)

func Load() (*Config, error) {
	cfg := DefaultConfig

	cfg.DbConfig.fromEnv()

	cfg.OAuthConfig.ClientConfig.fromEnv()
	cfg.OAuthConfig.TokenStorageConfig.fromEnv()

	return &cfg, nil
}

func (cnf *DbConfig) fromEnv() {
	cnf.Host = env.GetString("POSTGRES_HOST", cnf.Host)
	cnf.Port = env.GetUint16("POSTGRES_PORT", cnf.Port)
	cnf.User = env.GetString("POSTGRES_USER", cnf.User)
	cnf.Password = env.GetString("POSTGRES_PASSWORD", cnf.Password)
	cnf.DbName = env.GetString("POSTGRES_NAME", cnf.DbName)
}

func (cnf *OAuthClientConfig) fromEnv() {
	cnf.ClientId = env.GetString("OAUTH_CLIENT_ID", cnf.ClientId)
	cnf.ClientSecret = env.GetString("OAUTH_CLIENT_SECRET", cnf.ClientSecret)
}

func (cnf *OAuthTokenStorageConfig) fromEnv() {
	cnf.Host = env.GetString("REDIS_HOST", cnf.Host)
	cnf.DbNumber = env.GetUint8("REDIS_NR", cnf.DbNumber)
	cnf.Port = env.GetUint16("REDIS_PORT", cnf.Port)
	cnf.Password = env.GetString("REDIS_PASSWORD", cnf.Password)
}
