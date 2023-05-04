package model

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"created_at" gorm:"<-:create"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
