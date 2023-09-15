package config

import "invman/api/internal/app/env"

type Config struct {
	Database DatabaseConfig
}

type DatabaseConfig struct {
	Host     string
	Port     uint16
	User     string
	Password string
	Db       string
	SSL      SslMode
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
		Database: DefaultDatabaseConfig,
	}

	DefaultDatabaseConfig = DatabaseConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "",
		Db:       "postgres",
		SSL:      Disable,
	}
)

func New() Config {
	cfg := DefaultConfig

	cfg.Database.fromEnv()

	return cfg
}

func (cnf *DatabaseConfig) fromEnv() {
	cnf.Host = env.GetString("POSTGRES_HOST", cnf.Host)
	cnf.Port = env.GetUint16("POSTGRES_PORT", cnf.Port)
	cnf.User = env.GetString("POSTGRES_USER", cnf.User)
	cnf.Password = env.GetString("POSTGRES_PASSWORD", cnf.Password)
	cnf.Db = env.GetString("POSTGRES_DB", cnf.Db)
}
