package repository

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/graphql/graph/graph_model"
	"invman.com/graphql/src/infra/database/entity"
)

type Service interface {
	Get(uuid uuid.UUID) (entity.Service, error)
	GetList(first int, offset *int, order graph_model.ServiceOrderBy) ([]entity.Service, error)
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

// Supports forward pagination
func (r *service) GetList(first int, offset *int, order graph_model.ServiceOrderBy) ([]entity.Service, error) {
	var serviceList []entity.Service

	query := r.db

	if offset != nil {
		query = query.Offset(*offset)
	}

	result := query.
		Debug().
		Order(orderToString(order) + " " + order.Order.String()).
		Limit(first).
		Find(&serviceList)

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

func orderToString(order graph_model.ServiceOrderBy) string {
	switch order.Name {
	case graph_model.ServiceSubjectUUID:
		return "uuid"
	case graph_model.ServiceSubjectName:
		return "name"
	case graph_model.ServiceSubjectCreatedAt:
		return "created_at"
	case graph_model.ServiceSubjectUpdatedAt:
		return "updated_at"
	default:
		return "name"
	}
}
