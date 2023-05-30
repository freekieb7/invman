package usecase

import (
	"github.com/google/uuid"
	"invman.com/graphql/graph/graph_model"
	"invman.com/graphql/src/infra/database/entity"
	"invman.com/graphql/src/repository"
)

type service struct {
	serviceRepository repository.Service
}

type Service interface {
	Find(uuid uuid.UUID) (*entity.Service, error)
	FindList(first *int, after *string, last *int, before *string, order *graph_model.ServiceOrder) ([]entity.Service, error)
	Create(name string) (uuid.UUID, error)
	Update(service entity.Service) (entity.Service, error)
	Delete(uuid uuid.UUID) error
}

func NewServiceUsecase(serviceRepository repository.Service) Service {
	return &service{
		serviceRepository: serviceRepository,
	}
}

func (u *service) Find(uuid uuid.UUID) (*entity.Service, error) {
	service, err := u.serviceRepository.Get(uuid)
	return &service, err
}

func (u *service) FindList(first *int, after *string, last *int, before *string, order *graph_model.ServiceOrder) ([]entity.Service, error) {
	return u.serviceRepository.GetList(first, after, last, before, order)
}

func (u *service) Create(name string) (uuid.UUID, error) {
	return u.serviceRepository.Create(name)
}

func (u *service) Update(service entity.Service) (entity.Service, error) {
	err := u.serviceRepository.Update(service)

	if err != nil {
		return entity.Service{}, err
	}

	return u.serviceRepository.Get(service.UUID)
}

func (u *service) Delete(uuid uuid.UUID) error {
	return u.serviceRepository.Delete(uuid)
}
