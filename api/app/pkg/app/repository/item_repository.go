package repository

import (
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"

	"github.com/google/uuid"
)

type ItemRepository struct {
	database *database.Database
}

func NewItemRepository(database *database.Database) *ItemRepository {
	return &ItemRepository{
		database: database,
	}
}

func (repository *ItemRepository) Get(id uuid.UUID) (entity.Item, error) {
	var item entity.Item

	statement := "" +
		"SELECT id, group_id, attributes, created_at, updated_at " +
		"FROM tbl_item " +
		"WHERE id = $1;"
	row := repository.database.ConnPool.QueryRow(statement, id)

	err := row.Scan(&item.ID, &item.GroupID, &item.Attributes, &item.CreatedAt, &item.UpdatedAt)

	return item, database.ParseError(err)
}

func (repository *ItemRepository) List(limit *int, offset *int) ([]entity.Item, error) {
	var items []entity.Item

	if limit == nil {
		l := 10
		limit = &l
	}

	statement := "" +
		"SELECT id, group_id, attributes, created_at, updated_at " +
		"FROM tbl_item " +
		"LIMIT $1 " +
		"OFFSET $2 "
	rows, err := repository.database.ConnPool.Query(statement, limit, offset)

	if err != nil {
		return items, database.ParseError(err)
	}

	for rows.Next() {
		var item entity.Item

		if err := rows.Scan(&item.ID, &item.GroupID, &item.Attributes, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return items, database.ParseError(err)
		}

		items = append(items, item)
	}

	return items, database.ParseError(err)
}

func (repository *ItemRepository) Create(item entity.Item) error {
	statement := "" +
		"INSERT INTO tbl_item (id, group_id, attributes)" +
		"VALUES ($1,$2,$3);"
	_, err := repository.
		database.
		ConnPool.
		Exec(statement,
			item.ID,
			item.GroupID,
			item.Attributes,
		)

	return database.ParseError(err)
}

func (repository *ItemRepository) Delete(id uuid.UUID) error {
	statement := "" +
		"DELETE FROM tbl_item " +
		"WHERE id = $1"
	_, err := repository.database.ConnPool.Exec(statement, id)

	return database.ParseError(err)
}
