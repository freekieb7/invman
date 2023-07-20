package controller

import (
	"invman.com/service-api/src/entity"
	"invman.com/service-api/src/http"
	"invman.com/service-api/src/input"
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
	uuid, err := req.GetUrlParamUUID("uuid")

	if err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	service, err := controller.serviceRepository.Get(*uuid)

	if err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	res.SendJson(http.ResponseBody{
		Data: service,
	})
}

func (controller *serviceController) GetList(req http.Request, res http.Response) {
	cursor := req.GetQueryParamString("cursor", "")
	maxResults, err := req.GetQueryParamInt("max_results", 10)

	if err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	serviceList, nextCursor, err := controller.serviceRepository.GetList(param.GetServiceListParams{
		MaxResults: *maxResults,
		Cursor:     *cursor,
	})

	if err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	body := http.ResponseBody{

		Data: http.Json{
			"services":    serviceList,
			"next_cursor": nextCursor,
		},
	}

	res.SendJson(body)
}

func (controller *serviceController) Create(req http.Request, res http.Response) {
	var input input.CreateServiceInput

	if err := req.BindJsonBody(&input); err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	id, err := controller.serviceRepository.Create(entity.Service{
		Name: input.Name,
	})

	if err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	service, err := controller.serviceRepository.Get(id)

	if err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	res.SendJson(http.ResponseBody{
		Data: http.Json{
			"service": service,
		},
	})
}

func (controller *serviceController) Update(req http.Request, res http.Response) {
	uuid, err := req.GetUrlParamUUID("uuid")

	if err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	var json input.UpdateServiceInput

	if err := req.BindJsonBody(&json); err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	serviceData := entity.Service{
		UUID: *uuid,
		Name: json.Name,
	}

	if err := controller.serviceRepository.Update(serviceData); err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	updatedService, err := controller.serviceRepository.Get(serviceData.UUID)

	if err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	res.SendJson(http.ResponseBody{
		Data: http.Json{
			"service": updatedService,
		},
	})
}

func (controller *serviceController) Delete(req http.Request, res http.Response) {
	uuid, err := req.GetUrlParamUUID("uuid")

	if err != nil {
		res.SendError(http.StatusBadRequest, err.Error())
		return
	}

	if err := controller.serviceRepository.Delete(*uuid); err != nil {
		res.SendError(http.StatusInternalServerError, err.Error())
		return
	}

	res.SendJson(http.ResponseBody{})
}
