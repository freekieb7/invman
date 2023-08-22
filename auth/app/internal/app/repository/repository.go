package repository

import "database/sql"

type Repository struct {
	Account *accountRepository
}

func New(db *sql.DB) *Repository {
	return &Repository{
		Account: newAccountRepository(db),
	}
}
