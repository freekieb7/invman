package repository

import (
	"errors"
	"fmt"
	"invman/api/pkg/app/database"
	"invman/api/pkg/app/database/entity"
	"invman/api/pkg/app/validater"
	gql "invman/api/pkg/gqlgen/model"
	"time"

	"github.com/google/uuid"
)

type itemRepository struct {
	database      database.Database
	itemValidater validater.ItemValidater
}

type ItemRepository interface {
	Get(id uuid.UUID) (entity.Item, error)
	List(limit int, offset *int, filters []gql.ItemsFilter) ([]entity.Item, error)
	Create(item entity.Item) error
	Delete(id uuid.UUID) error
}

func NewItemRepository(database database.Database, itemValidater validater.ItemValidater) ItemRepository {
	return &itemRepository{
		database:      database,
		itemValidater: itemValidater,
	}
}

func (repository *itemRepository) Get(id uuid.UUID) (entity.Item, error) {
	var item entity.Item

	statement := "" +
		"SELECT id, pid, group_id, local_custom_fields, global_custom_fields_values, created_at, updated_at " +
		"FROM tbl_item " +
		"WHERE id = $1;"
	row := repository.database.QueryRow(statement, id)

	err := row.Scan(&item.ID, &item.PID, &item.GroupID, &item.LocalCustomFields, &item.GlobalCustomFieldsValues, &item.CreatedAt, &item.UpdatedAt)

	return item, database.ParseError(err)
}

func (repository *itemRepository) List(limit int, offset *int, filters []gql.ItemsFilter) ([]entity.Item, error) {
	var statement string
	var arguments []any

	statement += "" +
		"SELECT item.id, item.pid, item.group_id, item.local_custom_fields, item.global_custom_fields_values, item.created_at, item.updated_at " +
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

		if err := rows.Scan(&item.ID, &item.PID, &item.GroupID, &item.LocalCustomFields, &item.GlobalCustomFieldsValues, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return items, database.ParseError(err)
		}

		items = append(items, item)
	}

	return items, database.ParseError(err)
}

func (repository *itemRepository) Create(item entity.Item) error {
	if !repository.itemValidater.IsValid(item) {
		return errors.New("item repository: invalid item received")
	}

	statement := "" +
		"INSERT INTO tbl_item (id, pid, group_id, local_custom_fields, global_custom_fields_values) " +
		"VALUES (?,?,?,?,?);"
	_, err := repository.
		database.
		Exec(statement,
			item.ID,
			item.PID,
			item.GroupID,
			item.LocalCustomFields,
			item.GlobalCustomFieldsValues,
		)

	return database.ParseError(err)
}

func (repository *itemRepository) Delete(id uuid.UUID) error {
	statement := "" +
		"UPDATE tbl_item " +
		"SET deleted_at = $1 " +
		"WHERE id = $2;"
	_, err := repository.database.Exec(statement, time.Now(), id)

	return database.ParseError(err)
}
