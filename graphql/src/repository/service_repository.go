package repository

import (
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/graphql/graph/graph_model"
	"invman.com/graphql/src/infra/database/entity"
)

type Service interface {
	Get(uuid uuid.UUID) (entity.Service, error)
	GetList(first *int, after *string, last *int, before *string, order graph_model.ServiceOrder) ([]entity.Service, error)
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

func (r *service) GetList(first *int, after *string, last *int, before *string, order graph_model.ServiceOrder) ([]entity.Service, error) {
	var serviceList []entity.Service

	// FORWARD pagination
	if first != nil {
		query := r.db.Limit(*first)

		if after != nil {
			if order.Order == graph_model.OrderByAsc {
				query = query.Where("uuid > ?", *after)
			} else {
				query = query.Where("uuid < ?", *after)
			}
		}

		result := query.
			Order(orderToString(order) + " " + order.Order.String()).
			Find(&serviceList)

		return serviceList, result.Error
	}

	// BACKWARD pagination
	if last != nil {
		query := r.db.
			Where("deleted_at IS NULL").
			Limit(*last)

		if before != nil {
			if order.Order == graph_model.OrderByAsc {
				query = query.Where("uuid < ?", *after)
			} else {
				query = query.Where("uuid > ?", *after)
			}

		}

		if order.Order == graph_model.OrderByAsc {
			query = query.Order(orderToString(order) + " DESC")
		} else {
			query = query.Order(orderToString(order) + " ASC")
		}

		result := r.db.
			Table("(?) as services", query).
			Order(orderToString(order) + " " + order.Order.String()).
			Find(&serviceList)

		return serviceList, result.Error
	}

	return nil, errors.New("invalid parameters")
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

func orderToString(order graph_model.ServiceOrder) string {
	switch order.Name {
	case graph_model.ServiceColumnUUID:
		return "uuid"
	case graph_model.ServiceColumnName:
		return "name"
	case graph_model.ServiceColumnCreatedAt:
		return "created_at"
	case graph_model.ServiceColumnUpdatedAt:
		return "updated_at"
	default:
		return "name"
	}
}
