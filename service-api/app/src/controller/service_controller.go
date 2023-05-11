package controller

import (
	"invman.com/service-api/src/http"
	"invman.com/service-api/src/input"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/param"
	"invman.com/service-api/src/repository"
)

type ServiceController interface {
	Get(req http.Request, res http.Response)
	GetList(req http.Request, res http.Response)
	Create(req http.Request, res http.Response)
	Update(req http.Request, res http.Response)
	Delete(req http.Request, res http.Response)
}

type serviceController struct {
	serviceRepository repository.ServiceRepository
}

func NewServiceController(serviceRepository repository.ServiceRepository) ServiceController {
	return &serviceController{
		serviceRepository: serviceRepository,
	}
}

func (controller *serviceController) Get(req http.Request, res http.Response) {
	id, err := req.GetUrlParamInt("id")

	if err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	service, err := controller.serviceRepository.Get(uint(id))

	if err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	res.SendJson(service)
}

func (controller *serviceController) GetList(req http.Request, res http.Response) {
	cursor := req.GetQueryParamString("cursor", "")
	maxResults, err := req.GetQueryParamInt("max_results", 10)

	if err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	serviceList, err := controller.serviceRepository.GetList(param.GetServiceListParams{
		MaxResults: maxResults,
		Cursor:     cursor,
	})

	if err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	res.SendJson(serviceList)
}

func (controller *serviceController) Create(req http.Request, res http.Response) {
	var input input.CreateServiceInput

	if err := req.BindJsonBody(&input); err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	id, err := controller.serviceRepository.Create(model.Service{
		Name: input.Name,
	})

	if err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	service, err := controller.serviceRepository.Get(id)

	if err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	res.SendJson(service)
}

func (controller *serviceController) Update(req http.Request, res http.Response) {
	id, err := req.GetUrlParamInt("id")

	if err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	var json input.UpdateServiceInput

	if err := req.BindJsonBody(&json); err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	serviceData := model.Service{
		ID:   uint(id),
		Name: json.Name,
	}

	if err := controller.serviceRepository.Update(serviceData); err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	updatedService, err := controller.serviceRepository.Get(serviceData.ID)

	if err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	res.SendJson(updatedService)
}

func (controller *serviceController) Delete(req http.Request, res http.Response) {
	id, err := req.GetUrlParamInt("id")

	if err != nil {
		res.SendError(http.StatusBadRequest, err)
		return
	}

	if err := controller.serviceRepository.Delete(uint(id)); err != nil {
		res.SendError(http.StatusInternalServerError, err)
		return
	}

	res.SendJson(http.Json{"message": "OK"})
}
