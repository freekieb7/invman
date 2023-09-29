package repository

import (
	"invman/api/pkg/app/datasource/database"
	"invman/api/pkg/app/datasource/database/entity"
)

type SettingsRepository struct {
	database *database.Database
}

func NewSettingsRepository(database *database.Database) *SettingsRepository {
	return &SettingsRepository{
		database: database,
	}
}

func (repository *SettingsRepository) Get() (entity.Settings, error) {
	var settings entity.Settings
	statement := "" +
		"SELECT mod_inspections_active, items_custom_fields, updated_at " +
		"FROM tbl_settings " +
		"LIMIT 1"
	row := repository.database.QueryRow(statement)

	err := row.Scan(&settings.ModuleInspectionsActive, &settings.ItemsCustomFields, &settings.UpdatedAt)

	return settings, database.ParseError(err)
}

func (repository *SettingsRepository) Update(settings entity.Settings) error {
	statement := "" +
		"UPDATE tbl_settings " +
		"SET" +
		" mod_inspections_active = ?, " +
		" items_custom_fields = ?; "
	_, err := repository.database.Exec(statement,
		settings.ModuleInspectionsActive,
		settings.ItemsCustomFields,
	)

	return database.ParseError(err)
}
