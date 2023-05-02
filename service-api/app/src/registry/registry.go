package registry

import (
	"gorm.io/gorm"
	"invman.com/service-api/src/controller"
)

type Registry interface {
	NewController() controller.Controller
}

type registry struct {
	db *gorm.DB
}

func NewRegistry(db *gorm.DB) Registry {
	return &registry{
		db: db,
	}
}

func (r *registry) NewController() controller.Controller {
	return controller.Controller{
		Service: r.NewServiceController(),
	}
}
