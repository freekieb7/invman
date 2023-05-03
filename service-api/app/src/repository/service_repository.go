package repository

import (
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"invman.com/service-api/src/model"
)

type ServiceRepository interface {
	Get(id uint) model.Service
	GetList(page int) []model.Service
	Create(service model.Service) model.Service
	Update(service model.Service) model.Service
	Delete(id uint)
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{
		db: db,
	}
}

func (r *serviceRepository) Get(id uint) model.Service {
	var service model.Service
	r.db.First(&service, id)

	return service
}

func (r *serviceRepository) GetList(page int) []model.Service {
	var serviceList []model.Service
	r.db.Find(&serviceList).Limit(10).Offset(page * 10)

	return serviceList
}

func (r *serviceRepository) Create(serviceToCreate model.Service) model.Service {
	r.db.Create(&serviceToCreate)
	return serviceToCreate
}

func (r *serviceRepository) Update(serviceToUpdate model.Service) model.Service {
	serviceAfterUpdate := model.Service{
		Model: gorm.Model{
			ID: serviceToUpdate.ID,
		},
	}

	r.db.Model(&serviceAfterUpdate).Clauses(clause.Returning{}).UpdateColumns(model.Service{Name: serviceAfterUpdate.Name})
	return serviceAfterUpdate
}

func (r *serviceRepository) Delete(id uint) {
	r.db.Delete(&model.Service{}, id)
}
