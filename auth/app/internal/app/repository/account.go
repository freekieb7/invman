package repository

import (
	"fmt"
	"invman/auth/internal/app/database"
	"invman/auth/internal/app/database/entity"
	"invman/auth/internal/app/redis"
	"time"

	"github.com/google/uuid"
)

type accountRepository struct {
	database *database.Database
	redis    *redis.Redis
}

func newAccountRepository(database *database.Database, redis *redis.Redis) *accountRepository {
	return &accountRepository{
		database: database,
		redis:    redis,
	}
}

type AccountCreateInput struct {
	UUID         uuid.UUID
	Email        string
	Username     string
	PasswordHash string
}

func (repository *accountRepository) Create(input AccountCreateInput) *database.DbError {
	statement := "" +
		"INSERT INTO tbl_account (uuid, email, username, password)" +
		"VALUES ($1,$2,$3,$4);"
	_, err := repository.database.ConnPool.Exec(statement, input.UUID.String(), input.Email, input.Username, input.PasswordHash)

	return database.Wrap(err)
}

func (repository *accountRepository) GetUUIDByEmail(email string) (uuid uuid.UUID, err error) {
	stmt := "SELECT uuid FROM tbl_account WHERE email = $1 LIMIT 1"
	row := repository.database.ConnPool.QueryRow(stmt, email)

	err = row.Scan(&uuid)
	err = database.Wrap(err)
	return
}

func (repository *accountRepository) Get(uuid uuid.UUID) (account entity.Account, err error) {
	stmt := "SELECT email, username, password, verified FROM tbl_account WHERE uuid = $1"
	row := repository.database.ConnPool.QueryRow(stmt, uuid.String())

	account = entity.Account{
		UUID: uuid,
	}

	err = row.Scan(&account.Email, &account.Username, &account.Password, &account.Verified)
	err = database.Wrap(err)

	return account, err
}

func (repository *accountRepository) GetUUIDByVerificationToken(token string) (id uuid.UUID, err error) {
	key := fmt.Sprintf("v_token:%s", token)
	value, err := repository.redis.Get(key)

	if err != nil {
		return
	}

	id = uuid.MustParse(value)
	return
}

func (repository *accountRepository) SetUUIDByVerificationToken(uuid uuid.UUID, token string) error {
	key := fmt.Sprintf("v_token:%s", token)
	return repository.redis.Set(key, uuid.String(), time.Hour)
}
