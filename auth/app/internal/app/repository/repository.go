package repository

import (
	"invman/auth/internal/app/database"
	"invman/auth/internal/app/redis"
)

type Repository struct {
	Database *database.Database
	Account  *accountRepository
}

func New(database *database.Database, redis *redis.Redis) *Repository {
	return &Repository{
		Database: database,
		Account:  newAccountRepository(database, redis),
	}
}
