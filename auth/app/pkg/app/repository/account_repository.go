package repository

import (
	"invman/auth/pkg/app/datasource/database"
	"invman/auth/pkg/app/datasource/database/entity"
	"invman/auth/pkg/app/datasource/redis"

	"github.com/google/uuid"
)

type AccountRepository struct {
	database *database.Database
	redis    *redis.Redis
}

func NewAccountRepository(database *database.Database, redis *redis.Redis) *AccountRepository {
	return &AccountRepository{
		database: database,
		redis:    redis,
	}
}

func (repository *AccountRepository) Create(entity entity.Account) error {
	statement := "" +
		"INSERT INTO tbl_account (id, company_id, email, password, firstname, lastname)" +
		"VALUES ($1,$2,$3,$4,$5,$6);"
	_, err := repository.database.ConnPool.Exec(statement,
		entity.ID,
		entity.CompanyID,
		entity.Email,
		entity.Password,
		entity.Firstname,
		entity.Lastname,
	)

	return database.ParseError(err)
}

func (repository *AccountRepository) Get(id uuid.UUID) (entity.Account, error) {
	statement := "" +
		"SELECT id, company_id, email, password, firstname, lastname " +
		"FROM tbl_account " +
		"WHERE id = $1;"
	row := repository.database.ConnPool.QueryRow(statement, id)

	var account entity.Account
	err := row.Scan(
		&account.ID,
		&account.CompanyID,
		&account.Email,
		&account.Password,
		&account.Firstname,
		&account.Lastname,
	)

	return account, database.ParseError(err)
}

func (repository *AccountRepository) ExistsEmail(email string) (bool, error) {
	statement := "" +
		"SELECT 1 " +
		"FROM tbl_account " +
		"WHERE email = $1 " +
		"LIMIT 1;"
	rows, err := repository.database.ConnPool.Query(statement, email)

	if err != nil {
		return false, err
	}

	return rows.Next(), nil
}

func (repository *AccountRepository) GetByEmail(email string) (entity.Account, error) {
	statement := "" +
		"SELECT id, email, password, firstname, lastname " +
		"FROM tbl_account " +
		"WHERE email = $1;"
	row := repository.database.ConnPool.QueryRow(statement, email)

	var account entity.Account
	err := row.Scan(
		&account.ID,
		&account.Email,
		&account.Password,
		&account.Firstname,
		&account.Lastname,
	)

	return account, database.ParseError(err)
}

func (repository *AccountRepository) Update(entity entity.Account) error {
	statement := "" +
		"UPDATE tbl_account " +
		"SET email = $1, password = $2, firstname = $3, lastname = $4 " +
		"WHERE id = $5;"
	_, err := repository.database.ConnPool.Exec(statement,
		entity.Email,
		entity.Password,
		entity.Firstname,
		entity.Lastname,
		entity.ID,
	)

	return database.ParseError(err)
}
