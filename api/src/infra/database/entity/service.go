package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Service struct {
	UUID      uuid.UUID      `json:"uuid" gorm:"primarykey;type:uuid"`
	Gid       uuid.UUID      `json:"gid" gorm:"type:uuid;not null"`
	Name      string         `json:"name" gorm:"not null;type:varchar(100)"`
	CreatedBy uuid.UUID      `json:"created_by" gorm:"index;type:uuid"`
	CreatedAt time.Time      `json:"created_at" gorm:"<-:create"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (service *Service) BeforeCreate(tx *gorm.DB) (err error) {
	service.UUID = uuid.New()
	return
}
