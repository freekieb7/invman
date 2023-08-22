package repository

import (
	"database/sql"

	"github.com/google/uuid"
)

type accountRepository struct {
	db *sql.DB
}

func newAccountRepository(db *sql.DB) *accountRepository {
	return &accountRepository{
		db: db,
	}
}

type AccountCreateInput struct {
	Email        string
	Username     string
	PasswordHash string
}

func (repository *accountRepository) Create(input AccountCreateInput) error {
	stmt := "" +
		"INSERT INTO tbl_account (uuid, email, username, password)" +
		"VALUES ($1,$2,$3,$4);"
	_, err := repository.db.Exec(stmt, uuid.New().String(), input.Email, input.Username, input.PasswordHash)

	return err
}

func (repository *accountRepository) GetUUIDByEmail(email string) (uuid.UUID, error) {
	stmt := "SELECT uuid FROM tbl_account WHERE email = $1"
	row := repository.db.QueryRow(stmt, email)

	var uuid uuid.UUID
	err := row.Scan(&uuid)

	return uuid, err
}

type Account struct {
	UUID     uuid.UUID
	Email    string
	Username string
	Password string
	Verified bool
}

func (repository *accountRepository) Get(uuid uuid.UUID) (Account, error) {
	stmt := "SELECT email, username, password, verified FROM tbl_account WHERE uuid = $1"
	row := repository.db.QueryRow(stmt, uuid.String())

	account := Account{
		UUID: uuid,
	}

	err := row.Scan(&account.Email, &account.Username, &account.Password, &account.Verified)

	return account, err
}
