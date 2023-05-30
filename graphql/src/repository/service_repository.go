package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/graphql/src/infra/database/entity"
)

type Service interface {
	Get(uuid uuid.UUID) (entity.Service, error)
	GetList(first *int, after *string, last *int, before *string) ([]entity.Service, error)
	Create(name string) (uuid.UUID, error)
	Update(service entity.Service) error
	Delete(uuid uuid.UUID) error
}

type service struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) Service {
	return &service{
		db: db,
	}
}

func (r *service) Get(uuid uuid.UUID) (entity.Service, error) {
	var service entity.Service
	result := r.db.First(&service, uuid)

	return service, result.Error
}

func (r *service) GetList(first *int, after *string, last *int, before *string) ([]entity.Service, error) {
	var serviceList []entity.Service

	query := r.db
	subquery := r.db.Table("services")

	if first != nil {
		query = query.Limit(*first).Order("uuid ASC")
	}

	if last != nil {
		query = query.Limit(*last).Order("uuid DESC")
	}

	if after != nil {
		subquery = subquery.Where("uuid > ?", *after)
	}

	if before != nil {
		subquery = subquery.Where("uuid < ?", *before)
	}

	result := query.Table("(?) AS services", subquery).Order("uuid ASC").Find(&serviceList)
	return serviceList, result.Error
}

func (r *service) Create(name string) (uuid.UUID, error) {
	service := entity.Service{
		Name: name,
	}

	result := r.db.Create(&service)

	return service.UUID, result.Error
}

func (r *service) Update(service entity.Service) error {
	err := r.db.First(&entity.Service{}, service.UUID).Error

	if err != nil {
		return err
	}

	return r.db.Save(&service).Error
}

func (r *service) Delete(uuid uuid.UUID) error {
	result := r.db.Delete(&entity.Service{}, uuid)
	return result.Error
}
