package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"invman.com/service-api/src/input"
	"invman.com/service-api/src/model"
	"invman.com/service-api/src/repository"
)

type ServiceController interface {
	Get(ctx *gin.Context)
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
	var json input.CreateServiceInput
	if err := ctx.ShouldBindJSON(&json); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newService := model.Service{
		Name: json.Name,
	}

	createdService := controller.serviceRepository.Create(newService)
	ctx.IndentedJSON(http.StatusOK, createdService)
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

	serviceToUpdate := model.Service{
		Model: gorm.Model{
			ID: uint(id),
		},
		Name: json.Name,
	}

	updatedService := controller.serviceRepository.Update(serviceToUpdate)

	ctx.IndentedJSON(http.StatusOK, updatedService)
}

func (controller *serviceController) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	controller.serviceRepository.Delete(uint(id))

	ctx.IndentedJSON(http.StatusOK, gin.H{"message": "OK"})
}
