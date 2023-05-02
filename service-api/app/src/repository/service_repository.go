package repository

import (
	"gorm.io/gorm"
	"invman.com/service-api/src/model"
)

type ServiceRepository interface {
	Get() *model.Service
	GetList(page int) *[]model.Service
	Create(service *model.Service)
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{
		db: db,
	}
}

func (r *serviceRepository) Get() *model.Service {
	var service model.Service
	r.db.First(&service, 1)

	return &service
}

func (r *serviceRepository) GetList(page int) *[]model.Service {
	var serviceList []model.Service
	r.db.Find(&serviceList).Limit(10).Offset(page * 10)

	return &serviceList
}

func (r *serviceRepository) Create(service *model.Service) {
	r.db.Create(service)
}
