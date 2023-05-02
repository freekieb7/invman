package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/repository"
)

type ServiceController interface {
	Get(ctx *gin.Context)
	Create(ctx *gin.Context)
}

type serviceController struct {
	serviceRepository repository.ServiceRepository
}

type CreateServiceInput struct {
	Name string `form:"name" json:"name" xml:"name"  binding:"required"`
}

func NewServiceController(serviceRepository repository.ServiceRepository) ServiceController {
	return &serviceController{
		serviceRepository: serviceRepository,
	}
}

func (controller *serviceController) Get(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")

	page, err := strconv.Atoi(pageStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	serviceList := controller.serviceRepository.GetList(page)

	ctx.IndentedJSON(http.StatusOK, serviceList)
}

func (controller *serviceController) Create(ctx *gin.Context) {
	var json CreateServiceInput
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := &model.Service{
		Name: json.Name,
	}

	controller.serviceRepository.Create(service)

	ctx.IndentedJSON(http.StatusOK, service)
}
