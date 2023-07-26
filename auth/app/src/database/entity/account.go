package entity

import (
	"database/sql/driver"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type roleType string

const (
	ADMIN roleType = "ADMIN"
	USER  roleType = "USER"
)

func (rt *roleType) Scan(value interface{}) error {
	*rt = roleType(value.(string))
	return nil
}

func (rt roleType) Value() (driver.Value, error) {
	return string(rt), nil
}

type Account struct {
	UUID      uuid.UUID `gorm:"primarykey;type:uuid"`
	Email     string    `gorm:"unique;not null;type:varchar(100);default:null"`
	Nickname  string    `gorm:"not null;type:varchar(25);default:null"`
	Password  string    `gorm:"unique;not null;type:varchar(255);default:null"`
	Role      roleType  `gorm:"type:role_type;default:USER"`
	CreatedAt time.Time `gorm:"<-:create;not null"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (account *Account) BeforeCreate(tx *gorm.DB) (err error) {
	account.UUID = uuid.New()
	return
}
