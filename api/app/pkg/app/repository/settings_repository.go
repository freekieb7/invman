package repository

import (
	"invman/api/pkg/app/database"
	"invman/api/pkg/app/database/entity"
	"invman/api/pkg/app/factory"
)

type settingsRepository struct {
	database        database.Database
	settingsFactory factory.SettingsFactory
}

type SettingsRepository interface {
	Get() (entity.Settings, error)
	Update(settings entity.Settings) error
}

func NewSettingsRepository(database database.Database, settingsFactory factory.SettingsFactory) SettingsRepository {
	return &settingsRepository{
		database:        database,
		settingsFactory: settingsFactory,
	}
}

func (repository *settingsRepository) Get() (entity.Settings, error) {
	settings := repository.settingsFactory.New()

	statement := "" +
		"SELECT mod_inspections_active, items_custom_fields, updated_at " +
		"FROM tbl_settings " +
		"LIMIT 1"
	row := repository.database.QueryRow(statement)

	err := row.Scan(&settings.ModuleInspectionsActive, &settings.ItemsCustomFields, &settings.UpdatedAt)

	return settings, database.ParseError(err)
}

func (repository *settingsRepository) Update(settings entity.Settings) error {
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
