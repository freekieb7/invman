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

func (repository *accountRepository) Create(input AccountCreateInput) database.DbError {
	statement := "" +
		"INSERT INTO tbl_account (uuid, email, username, password)" +
		"VALUES ($1,$2,$3,$4);"
	_, err := repository.database.ConnPool.Exec(statement, input.UUID.String(), input.Email, input.Username, input.PasswordHash)

	return database.Wrap(err)
}

func (repository *accountRepository) GetUUIDByEmail(email string) (uuid.UUID, database.DbError) {
	var accountUUID uuid.UUID

	stmt := "SELECT uuid FROM tbl_account WHERE email = $1 LIMIT 1"
	row := repository.
		database.
		ConnPool.
		QueryRow(
			stmt,
			email,
		)

	rowErr := row.Scan(&accountUUID)
	dbErr := database.Wrap(rowErr)

	return accountUUID, dbErr
}

func (repository *accountRepository) Get(uuid uuid.UUID) (entity.Account, database.DbError) {
	stmt := "SELECT email, username, password, verified FROM tbl_account WHERE uuid = $1"
	row := repository.database.ConnPool.QueryRow(stmt, uuid.String())

	account := entity.Account{
		UUID: uuid,
	}

	rowErr := row.Scan(&account.Email, &account.Username, &account.Password, &account.Verified)
	dbErr := database.Wrap(rowErr)

	return account, dbErr
}

func (repository *accountRepository) UpdateVerified(uuid uuid.UUID, verified bool) database.DbError {
	stmt := "UPDATE tbl_account SET verified = $1 WHERE uuid = $2"
	_, rowErr := repository.database.ConnPool.Exec(stmt, verified, uuid.String())

	dbErr := database.Wrap(rowErr)
	return dbErr
}

func (repository *accountRepository) UpdatePassword(uuid uuid.UUID, passwordHash string) database.DbError {
	stmt := "UPDATE tbl_account SET password = $1 WHERE uuid = $2"
	_, rowErr := repository.database.ConnPool.Exec(stmt, passwordHash, uuid.String())

	dbErr := database.Wrap(rowErr)
	return dbErr
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

func (repository *accountRepository) GetUUIDByResetToken(token string) (id uuid.UUID, err error) {
	key := fmt.Sprintf("r_token:%s", token)
	value, err := repository.redis.Get(key)

	if err != nil {
		return
	}

	id = uuid.MustParse(value)
	return
}

func (repository *accountRepository) SetUUIDByResetToken(uuid uuid.UUID, token string) error {
	key := fmt.Sprintf("r_token:%s", token)
	return repository.redis.Set(key, uuid.String(), time.Hour)
}
