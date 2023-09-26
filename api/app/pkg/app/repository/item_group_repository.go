package repository

import (
	"fmt"
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"
	gql "invman/api/pkg/gqlgen/model"
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
		"SELECT id, name, created_at, updated_at " +
		"FROM tbl_item_group " +
		"WHERE id = $1;"
	row := repository.database.QueryRow(statement, id)

	err := row.Scan(&itemGroup.ID, &itemGroup.Name, &itemGroup.CreatedAt, &itemGroup.UpdatedAt)

	return itemGroup, database.ParseError(err)
}

func (repository *ItemGroupRepository) List(limit int, offset *int, filters []gql.ItemGroupsFilter) ([]entity.ItemGroup, error) {
	var itemGroups []entity.ItemGroup

	var statement string
	var arguments []any

	statement += "" +
		"SELECT id, name, created_at, updated_at " +
		"FROM tbl_item_group " +
		"WHERE deleted_at IS NULL "

	for _, filter := range filters {
		switch filter.Subject {
		case gql.ItemGroupsFilterSubjectName:
			{
				switch filter.Operator {
				case gql.FilterOperatorEquals:
					{
						statement += "AND name = ? "
						arguments = append(arguments, filter.Value)
					}
				case gql.FilterOperatorContains:
					{
						statement += "AND name LIKE '%' || ? || '%' "
						arguments = append(arguments, filter.Value)
					}
				default:
					return nil, fmt.Errorf("item repository: subject '%s' with operator '%s' is not yet supported", filter.Subject, filter.Operator)
				}
			}
		default:
			return nil, fmt.Errorf("item repository: subject '%s' is not yet supported", filter.Subject)
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

		if err := rows.Scan(&itemGroup.ID, &itemGroup.Name, &itemGroup.CreatedAt, &itemGroup.UpdatedAt); err != nil {
			return itemGroups, database.ParseError(err)
		}

		itemGroups = append(itemGroups, itemGroup)
	}

	return itemGroups, database.ParseError(err)
}

func (repository *ItemGroupRepository) Create(itemGroup entity.ItemGroup) error {
	statement := "" +
		"INSERT INTO tbl_item_group (id, name)" +
		"VALUES ($1,$2,$3);"
	_, err := repository.
		database.
		Exec(statement,
			itemGroup.ID,
			itemGroup.Name,
		)

	return database.ParseError(err)
}

func (repository *ItemGroupRepository) Delete(id uuid.UUID) error {
	// TODO what to do with attached items
	statement := "" +
		"UPDATE tbl_item_group " +
		"SET deleted_at = $1 " +
		"WHERE id = $2;"
	_, err := repository.database.Exec(statement, time.Now(), id)

	return database.ParseError(err)
}
