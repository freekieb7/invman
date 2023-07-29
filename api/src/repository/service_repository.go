package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"invman.com/graphql/graph/graph_model"
	"invman.com/graphql/src/infra/auth"
	"invman.com/graphql/src/infra/database/entity"
)

type Service interface {
	Get(ctx *context.Context, id uuid.UUID) (entity.Service, error)
	GetList(ctx *context.Context, input graph_model.ServicesInput) ([]entity.Service, error)
	Create(ctx *context.Context, name string) (uuid.UUID, error)
	Update(ctx *context.Context, service entity.Service) error
	Delete(ctx *context.Context, uuid uuid.UUID) error
}

type service struct {
	db *gorm.DB
}

func NewServiceRepository(db *gorm.DB) Service {
	return &service{
		db: db,
	}
}

func (r *service) Get(ctx *context.Context, uuid uuid.UUID) (entity.Service, error) {
	var service entity.Service
	groupId := auth.GroupId(ctx)

	result := r.db.Where("gid = ?", groupId.String()).First(&service, uuid)

	return service, result.Error
}

func (r *service) GetList(ctx *context.Context, input graph_model.ServicesInput) ([]entity.Service, error) {
	var serviceList []entity.Service
	groupId := auth.GroupId(ctx)

	query := r.db.Where("gid = ?", groupId)

	// UUID filter
	if input.ID != nil {
		fieldName := "uuid::text"
		queryWithFilter, err := textFilterToQuery(query, fieldName, *input.ID)

		if err != nil {
			return nil, err
		}

		query = queryWithFilter
	}

	// Name filter
	if input.Name != nil {
		fieldName := "name"
		queryWithFilter, err := textFilterToQuery(query, fieldName, *input.Name)

		if err != nil {
			return nil, err
		}

		query = queryWithFilter
	}

	// Created at filter
	if input.CreatedAt != nil {
		fieldName := "created_at"

		queryWithFilter, err := dateTimeFilterToQuery(query, fieldName, *input.CreatedAt)

		if err != nil {
			return nil, err
		}

		query = queryWithFilter
	}

	// Updated at filter
	if input.UpdatedAt != nil {
		fieldName := "updated_at"
		queryWithFilter, err := dateTimeFilterToQuery(query, fieldName, *input.UpdatedAt)

		if err != nil {
			return nil, err
		}

		query = queryWithFilter
	}

	// Order by
	if input.Order != nil {
		queryWithOrder, err := orderToQuery(query, *input.Order)

		if err != nil {
			return nil, err
		}

		query = queryWithOrder
	}

	// Set Pagination Conditions
	query = query.Limit(input.Limit)

	if input.Offset != nil {
		query = query.Offset(*input.Offset)
	}

	result := query.Debug().Find(&serviceList)

	return serviceList, result.Error
}

func (r *service) Create(ctx *context.Context, name string) (uuid.UUID, error) {
	userId := auth.UserId(ctx)
	groupId := auth.GroupId(ctx)

	service := entity.Service{
		Name:      name,
		Gid:       groupId,
		CreatedBy: userId,
	}

	result := r.db.Create(&service)

	return service.UUID, result.Error
}

func (r *service) Update(ctx *context.Context, service entity.Service) error {
	err := r.db.First(&entity.Service{}, service.UUID).Error

	if err != nil {
		return err
	}

	return r.db.Save(&service).Error
}

func (r *service) Delete(ctx *context.Context, uuid uuid.UUID) error {
	result := r.db.Delete(&entity.Service{}, uuid)
	return result.Error
}

func textFilterToQuery(query *gorm.DB, fieldName string, filter graph_model.TextFilter) (*gorm.DB, error) {
	switch filter.Operator {
	case graph_model.TextFilterOperatorContains:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'contains' operator without value")
		}

		query = query.Where(fieldName+" LIKE ?", "%"+*filter.Value+"%")
	case graph_model.TextFilterOperatorEquals:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'equals' operator without value")
		}

		query = query.Where(fieldName+" = ?", *filter.Value)
	case graph_model.TextFilterOperatorIsEmpty:
		query = query.Where(fieldName + " IS NULL")
	case graph_model.TextFilterOperatorStartsWith:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'starts with' operator without value")
		}

		query = query.Where(fieldName+" LIKE ?", *filter.Value+"%")
	case graph_model.TextFilterOperatorEndsWith:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'ends with' operator without value")
		}

		query = query.Where(fieldName+" LIKE ?", "%"+*filter.Value)
	case graph_model.TextFilterOperatorIsNotEmpty:
		query = query.Where(fieldName + " IS NOT NULL")
	default:
		return nil, errors.New("filter operator not supported")
	}

	return query, nil
}

func dateTimeFilterToQuery(query *gorm.DB, fieldName string, filter graph_model.DateTimeFilter) (*gorm.DB, error) {
	// WHERE condition
	switch filter.Operator {
	case graph_model.DateTimeFilterOperatorIsAfterOrOn:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'is after or on' operator without value")
		}

		query = query.Where(fieldName+" >= ?", *filter.Value)
	case graph_model.DateTimeFilterOperatorIsBeforeOrOn:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'is before or on' operator without value")
		}

		query = query.Where(fieldName+" <= ?", *filter.Value)
	case graph_model.DateTimeFilterOperatorIsBetweenOrOn:
		if filter.Value == nil {
			break
			return nil, errors.New("filter uses 'is between or on' operator without value")
		}

		query = query.Where(fieldName+" >= ?", *filter.Value)
		query = query.Where(fieldName+" <= ?", *filter.Value)
	case graph_model.DateTimeFilterOperatorIsEmpty:
		query = query.Where(fieldName + " IS NULL")
	case graph_model.DateTimeFilterOperatorIsNotEmpty:
		query = query.Where(fieldName + " IS NOT NULL")
	default:
		return nil, errors.New("filter operator not supported")
	}

	return query, nil
}

func orderToQuery(query *gorm.DB, order graph_model.ServicesOrder) (*gorm.DB, error) {
	// ORDER condition
	var fieldName string

	switch order.Subject {
	case graph_model.ServicesOrderSubjectID:
		fieldName = "uuid"
	case graph_model.ServicesOrderSubjectName:
		fieldName = "name"
	case graph_model.ServicesOrderSubjectCreatedAt:
		fieldName = "created_at"
	case graph_model.ServicesOrderSubjectUpdatedAt:
		fieldName = "updated_at"
	}

	switch order.Order {
	case graph_model.OrderDirectionAsc:
		query = query.Order(fieldName + " ASC")
	case graph_model.OrderDirectionDesc:
		query = query.Order(fieldName + " DESC")
	}

	return query, nil
}

// func dateFilterToQuery(query *gorm.DB, fieldName string, filter graph_model.DateFilter) (*gorm.DB, error) {
// 	// WHERE condition
// 	switch filter.Operator {
// 	case graph_model.DateFilterOperatorIs:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is' operator without value")
// 		}

// 		query = query.Where(fieldName+" = ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsNot:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is not' operator without value")
// 		}

// 		query = query.Where(fieldName+" != ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsAfter:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is after' operator without value")
// 		}

// 		query = query.Where(fieldName+" > ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsAfterOrOn:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is after or on' operator without value")
// 		}

// 		query = query.Where(fieldName+" >= ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsBefore:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is before' operator without value")
// 		}

// 		query = query.Where(fieldName+" < ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsBeforeOrOn:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is before or on' operator without value")
// 		}

// 		query = query.Where(fieldName+" <= ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsBetween:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is between' operator without value")
// 		}

// 		query = query.Where(fieldName+" > ?", *filter.Value)
// 		query.Where(fieldName+" < ?", &filter.Value)
// 	case graph_model.DateFilterOperatorIsBetweenOrOn:
// 		if filter.Value == nil {
// 			return nil, errors.New("filter uses 'is between or on' operator without value")
// 		}

// 		query = query.Where(fieldName+" >= ?", *filter.Value)
// 		query = query.Where(fieldName+" <= ?", *filter.Value)
// 	case graph_model.DateFilterOperatorIsEmpty:
// 		query = query.Where(fieldName + " IS NULL")
// 	case graph_model.DateFilterOperatorIsNotEmpty:
// 		query = query.Where(fieldName + " IS NOT NULL")
// 	default:
// 		return nil, errors.New("filter operator not supported")
// 	}

// 	// ORDER condition
// 	if filter.Order != nil {
// 		switch *filter.Order {
// 		case graph_model.OrderDirectionAsc:
// 			query = query.Order(fieldName + " ASC")
// 		case graph_model.OrderDirectionDesc:
// 			query = query.Order(fieldName + " DESC")
// 		}
// 	}

// 	return query, nil
// }
