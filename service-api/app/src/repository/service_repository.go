package repository

import (
	"gorm.io/gorm"
	"invman.com/service-api/src/model"
)

type ServiceRepository interface {
	Get(id uint) (model.Service, error)
	GetList(page int) ([]model.Service, error)
	Create(service model.Service) (uint, error)
	Update(service model.Service) error
	Delete(id uint) error
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{
		db: db,
	}
}

func (r *serviceRepository) Get(id uint) (model.Service, error) {
	var service model.Service
	result := r.db.First(&service, id)

	return service, result.Error
}

func (r *serviceRepository) GetList(page int) ([]model.Service, error) {
	var serviceList []model.Service
	result := r.db.Find(&serviceList).Limit(10).Offset(page * 10)

	return serviceList, result.Error
}

func (r *serviceRepository) Create(service model.Service) (uint, error) {
	result := r.db.Create(&service)
	return service.ID, result.Error
}

func (r *serviceRepository) Update(service model.Service) error {
	err := r.db.First(&model.Service{}, service.ID).Error

	if err != nil {
		return err
	}

	return r.db.Save(&service).Error
}

func (r *serviceRepository) Delete(id uint) error {
	result := r.db.Delete(&model.Service{}, id)
	return result.Error
}
