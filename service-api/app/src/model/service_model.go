package model

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	gorm.Model
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}
