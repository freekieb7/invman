package repository

import (
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"
	"invman/api/pkg/gqlgen/model"
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

	statement := "" +
		"SELECT id, name, attributes, created_at, updated_at " +
		"FROM tbl_item_group " +
		"WHERE id = $1;"
	row := repository.database.QueryRow(statement, id)

	err := row.Scan(&itemGroup.ID, &itemGroup.Name, &itemGroup.Attributes, &itemGroup.CreatedAt, &itemGroup.UpdatedAt)

	return itemGroup, database.ParseError(err)
}

func (repository *ItemGroupRepository) List(limit int, offset *int, filter *model.ItemGroupsFilter) ([]entity.ItemGroup, error) {
	var itemGroups []entity.ItemGroup

	var statement string
	var arguments []any

	statement += "" +
		"SELECT id, name, attributes, created_at, updated_at " +
		"FROM tbl_item_group " +
		"WHERE deleted_at IS NULL "

	if filter != nil {
		if filter.Name != nil {
			if filter.Name.Operator == model.TextFilterOperatorContains {
				statement += "AND name LIKE '%' || ? || '%' "
				arguments = append(arguments, filter.Name.Value)
			}
		}
	}

	statement += "LIMIT ? "
	arguments = append(arguments, limit)

	if offset != nil {
		statement += "OFFSET ? "
		arguments = append(arguments, offset)
	}

	rows, err := repository.database.Query(statement, arguments...)

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
	_, err := repository.database.Exec(statement, time.Now(), id)

	return database.ParseError(err)
}
