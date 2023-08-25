package migration

import (
	"errors"
	"invman/auth/internal/app/database"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"

	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type Migrater struct {
	migrate *migrate.Migrate
}

func New(database *database.Database) *Migrater {
	driver, err := postgres.WithInstance(database.Database(), &postgres.Config{})

	if err != nil {
		panic(err)
	}

	migrate, err := migrate.NewWithDatabaseInstance(
		"file:///app/internal/app/database/migration/script",
		"postgres", driver)

	if err != nil {
		panic(err)
	}

	return &Migrater{
		migrate: migrate,
	}
}

func (m *Migrater) Up() error {
	if err := m.migrate.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			// Do nothing
		} else {
			return err
		}
	}

	return nil
}
