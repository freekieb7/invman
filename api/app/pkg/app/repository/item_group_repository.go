package repository

import (
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"
	"log"
	"time"

	"github.com/google/uuid"
)

type ItemGroupRepository struct {
	database *database.Database
}

func NewItemGroupRepository(database *database.Database) *ItemGroupRepository {
	return &ItemGroupRepository{
		database: database,
	}
}

func (repository *ItemGroupRepository) Get(id uuid.UUID) (entity.ItemGroup, error) {
	var itemGroup entity.ItemGroup

	log.Print(id)

	statement := "" +
		"SELECT id, name, attributes, created_at, updated_at " +
		"FROM tbl_item_group " +
		"WHERE id = $1;"
	row := repository.database.ConnPool.QueryRow(statement, id)

	err := row.Scan(&itemGroup.ID, &itemGroup.Name, &itemGroup.Attributes, &itemGroup.CreatedAt, &itemGroup.UpdatedAt)

	return itemGroup, database.ParseError(err)
}

func (repository *ItemGroupRepository) List(limit *int, offset *int) ([]entity.ItemGroup, error) {
	var itemGroups []entity.ItemGroup

	if limit == nil {
		l := 10
		limit = &l
	}

	statement := "" +
		"SELECT id, name, attributes, created_at, updated_at " +
		"FROM tbl_item_group " +
		"LIMIT $1 " +
		"OFFSET $2 "
	rows, err := repository.database.ConnPool.Query(statement, limit, offset)

	if err != nil {
		return itemGroups, database.ParseError(err)
	}

	for rows.Next() {
		var itemGroup entity.ItemGroup

		if err := rows.Scan(&itemGroup.ID, &itemGroup.Name, &itemGroup.Attributes, &itemGroup.CreatedAt, &itemGroup.UpdatedAt); err != nil {
			return itemGroups, database.ParseError(err)
		}

		itemGroups = append(itemGroups, itemGroup)
	}

	return itemGroups, database.ParseError(err)
}

func (repository *ItemGroupRepository) Create(itemGroup entity.ItemGroup) error {
	statement := "" +
		"INSERT INTO tbl_item_group (id, name, attributes)" +
		"VALUES ($1,$2,$3);"
	_, err := repository.
		database.
		ConnPool.
		Exec(statement,
			itemGroup.ID,
			itemGroup.Name,
			itemGroup.Attributes,
		)

	return database.ParseError(err)
}

func (repository *ItemGroupRepository) Delete(id uuid.UUID) error {
	statement := "" +
		"UPDATE tbl_item_group " +
		"SET deleted_at = $1 " +
		"WHERE id = $2;"
	_, err := repository.database.ConnPool.Exec(statement, time.Now(), id)

	return database.ParseError(err)
}
