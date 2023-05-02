package registry

import (
	"invman.com/service-api/src/controller"
	"invman.com/service-api/src/repository"
)

func (r *registry) NewServiceController() controller.ServiceController {
	serviceRepository := repository.NewServiceRepository(r.db)

	return controller.NewServiceController(
		serviceRepository,
	)
}
