package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Account struct {
	UUID        uuid.UUID `gorm:"primarykey;type:uuid"`
	Email       string    `gorm:"unique;not null;type:varchar(100);default:null"`
	DisplayName string    `gorm:"unique;not null;type:varchar(25);default:null"`
	Password    string    `gorm:"unique;not null;type:varchar(255);default:null"`
	CreatedAt   time.Time `gorm:"<-:create;not null"`
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

func (account *Account) BeforeCreate(tx *gorm.DB) (err error) {
	account.UUID = uuid.New()
	return
}
