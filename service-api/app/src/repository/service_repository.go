package repository

import (
	"strconv"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/service-api/src/entity"
	"invman.com/service-api/src/param"
)

type ServiceRepository interface {
	Get(uuid uuid.UUID) (entity.Service, error)
	GetList(params param.GetServiceListParams) ([]entity.Service, *string, error)
	Create(service entity.Service) (uuid.UUID, error)
	Update(service entity.Service) error
	Delete(uuid uuid.UUID) error
}

type serviceRepository struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) ServiceRepository {
	return &serviceRepository{
		db: db,
	}
}

func (r *serviceRepository) Get(uuid uuid.UUID) (entity.Service, error) {
	var service entity.Service
	result := r.db.First(&service, uuid)

	return service, result.Error
}

func (r *serviceRepository) GetList(params param.GetServiceListParams) ([]entity.Service, *string, error) {
	var serviceList []entity.Service

	query := r.db.Limit(params.MaxResults).Order("uuid ASC")

	// Cursor based pagination
	serviceId, err := strconv.Atoi(params.Cursor)
	if err == nil {
		query.Where("uuid > ?", serviceId)
	}

	result := query.Find(&serviceList)

	if len(serviceList) == 0 {
		return serviceList, nil, result.Error
	}

	nextCursor := serviceList[len(serviceList)-1].UUID.String()

	return serviceList, &nextCursor, result.Error
}

func (r *serviceRepository) Create(service entity.Service) (uuid.UUID, error) {
	result := r.db.Create(&service)
	return service.UUID, result.Error
}

func (r *serviceRepository) Update(service entity.Service) error {
	err := r.db.First(&entity.Service{}, service.UUID).Error

	if err != nil {
		return err
	}

	return r.db.Save(&service).Error
}

func (r *serviceRepository) Delete(uuid uuid.UUID) error {
	result := r.db.Delete(&entity.Service{}, uuid)
	return result.Error
}
