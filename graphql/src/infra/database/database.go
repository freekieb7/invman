package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPool() *gorm.DB {
	connStr := "host=service-db user=postgres password=example dbname=postgres port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	return db
}
