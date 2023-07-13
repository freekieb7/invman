package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	UUID      uuid.UUID `json:"uuid" gorm:"primarykey;type:uuid"`
	Username  string    `json:"Username"`
	Password  string
	CreatedAt time.Time      `json:"created_at" gorm:"<-:create"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	user.UUID = uuid.New()
	return
}
