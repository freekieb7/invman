package model

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	gorm.Model
	Name      string
	CreatedAt time.Time `gorm:"<-:create"` // Prevents update
}
