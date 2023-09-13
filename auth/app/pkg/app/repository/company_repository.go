package repository

import (
	"invman/auth/pkg/app/datasource/database"
	"invman/auth/pkg/app/datasource/database/entity"
)

type CompanyRepository struct {
	database *database.Database
}

func NewCompanyRepository(database *database.Database) *CompanyRepository {
	return &CompanyRepository{
		database: database,
	}
}

func (repository *CompanyRepository) Create(entity entity.Company) error {
	statement := "" +
		"INSERT INTO tbl_company (id, name)" +
		"VALUES ($1,$2);"
	_, err := repository.database.ConnPool.Exec(statement,
		entity.ID,
		entity.Name,
	)

	return database.ParseError(err)
}
