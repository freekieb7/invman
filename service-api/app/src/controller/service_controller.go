package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"invman.com/service-api/src/input"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/repository"
)

type ServiceController interface {
	Get(ctx *gin.Context)
	GetList(ctx *gin.Context)
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	Delete(ctx *gin.Context)
}

type serviceController struct {
	serviceRepository repository.ServiceRepository
}

func NewServiceController(serviceRepository repository.ServiceRepository) ServiceController {
	return &serviceController{
		serviceRepository: serviceRepository,
	}
}

func (controller *serviceController) Get(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	service, err := controller.serviceRepository.Get(uint(id))

	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.IndentedJSON(http.StatusOK, service)
}

func (controller *serviceController) GetList(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")

	page, err := strconv.Atoi(pageStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	serviceList, err := controller.serviceRepository.GetList(page)

	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.IndentedJSON(http.StatusOK, serviceList)
}

func (controller *serviceController) Create(ctx *gin.Context) {
	var json input.CreateServiceInput
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newService := model.Service{
		Name: json.Name,
	}

	id, err := controller.serviceRepository.Create(newService)

	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	service, err := controller.serviceRepository.Get(id)

	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.IndentedJSON(http.StatusOK, service)
}

func (controller *serviceController) Update(ctx *gin.Context) {
	var json input.UpdateServiceInput
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "error occurred", "error": err.Error()})
		return
	}

	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	serviceData := model.Service{
		ID: uint(id),

		Name: json.Name,
	}

	if err := controller.serviceRepository.Update(serviceData); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	updatedService, err := controller.serviceRepository.Get(serviceData.ID)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	ctx.IndentedJSON(http.StatusOK, updatedService)
}

func (controller *serviceController) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := controller.serviceRepository.Delete(uint(id)); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.IndentedJSON(http.StatusOK, gin.H{"message": "OK"})
}
