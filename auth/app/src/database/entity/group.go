package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Group struct {
	UUID      uuid.UUID `gorm:"primarykey;type:uuid"`
	Account   []Account `gorm:"foreignKey:GroupId;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Name      string    `gorm:"not null;type:varchar(50)"`
	CreatedAt time.Time `gorm:"<-:create;not null"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (group *Group) BeforeCreate(tx *gorm.DB) (err error) {
	group.UUID = uuid.New()
	return
}
