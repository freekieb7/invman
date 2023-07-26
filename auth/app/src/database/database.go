package database

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"invman.com/oauth/src/config"
)

func NewConn(cnf *config.DbConfig) *gorm.DB {
	connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		cnf.Host,
		cnf.User,
		cnf.Password,
		cnf.DbName,
		cnf.Port,
		cnf.SSL,
	)
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	return db
}
