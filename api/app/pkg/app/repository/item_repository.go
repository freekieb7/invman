package repository

import (
	"fmt"
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"
	gql "invman/api/pkg/gqlgen/model"
	"time"

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
		"SELECT id, pid, group_id, custom_fields_with_value, created_at, updated_at " +
		"FROM tbl_item " +
		"WHERE id = $1;"
	row := repository.database.QueryRow(statement, id)

	err := row.Scan(&item.ID, &item.PID, &item.GroupID, &item.CustomFieldsWithValue, &item.CreatedAt, &item.UpdatedAt)

	return item, database.ParseError(err)
}

func (repository *ItemRepository) List(limit int, offset *int, filters []gql.ItemsFilter) ([]entity.Item, error) {
	var statement string
	var arguments []any

	statement += "" +
		"SELECT item.id, item.pid, item.group_id, item.custom_fields_with_value, item.custom_fields_values, item.created_at, item.updated_at " +
		"FROM tbl_item item " +
		"LEFT JOIN tbl_item_group item_group ON item.group_id = item_group.id " +
		"WHERE item.deleted_at IS NULL "

	for _, filter := range filters {
		switch filter.Subject {
		case gql.ItemsFilterSubjectGroup:
			{
				switch filter.Operator {
				case gql.FilterOperatorEquals:
					{
						statement += "AND item.group_id = ? "
						arguments = append(arguments, filter.Value)
					}
				case gql.FilterOperatorContains:
					{
						statement += "AND item_group.name LIKE '%' || ? || '%' "
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
		return nil, database.ParseError(err)
	}

	var items []entity.Item

	for rows.Next() {
		var item entity.Item

		if err := rows.Scan(&item.ID, &item.PID, &item.GroupID, &item.CustomFieldsWithValue, &item.CustomFieldsWithValue, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return items, database.ParseError(err)
		}

		items = append(items, item)
	}

	return items, database.ParseError(err)
}

func (repository *ItemRepository) Create(item entity.Item) error {
	statement := "" +
		"INSERT INTO tbl_item (id, pid, group_id, custom_fields_with_value) " +
		"VALUES (?,?,?,?);"
	_, err := repository.
		database.
		Exec(statement,
			item.ID,
			item.PID,
			item.GroupID,
			item.CustomFieldsWithValue,
		)

	return database.ParseError(err)
}

func (repository *ItemRepository) Delete(id uuid.UUID) error {
	statement := "" +
		"UPDATE tbl_item " +
		"SET deleted_at = $1 " +
		"WHERE id = $2;"
	_, err := repository.database.Exec(statement, time.Now(), id)

	return database.ParseError(err)
}
