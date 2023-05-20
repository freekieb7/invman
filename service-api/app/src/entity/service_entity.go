package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	UUID      uuid.UUID      `json:"uuid" gorm:"primarykey;type:uuid"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"created_at" gorm:"<-:create"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (service *Service) BeforeCreate(tx *gorm.DB) (err error) {
	service.UUID = uuid.New()
	return
}
