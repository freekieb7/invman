package migration

import (
	"errors"
	"fmt"
	"invman/api/pkg/app/database"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"

	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type Migrater struct {
	migrate *migrate.Migrate
}

func New(database database.Database) *Migrater {
	driver, err := postgres.WithInstance(database.Connection(), &postgres.Config{})

	if err != nil {
		panic(err)
	}

	dir, _ := os.Getwd()

	migrate, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s/pkg/app/database/migration/script", dir),
		"postgres", driver)

	if err != nil {
		panic(err)
	}

	return &Migrater{
		migrate: migrate,
	}
}

func (m *Migrater) Up() {
	if err := m.migrate.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			// Do nothing
		} else {
			panic(err)
		}
	}
}

func (m *Migrater) Down() {
	if err := m.migrate.Down(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			// Do nothing
		} else {
			panic(err)
		}
	}
}

func (m *Migrater) Drop() {
	if err := m.migrate.Drop(); err != nil {
		panic(err)
	}
}
