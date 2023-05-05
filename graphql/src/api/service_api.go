package api

import (
	"encoding/json"
	"fmt"
	"io"

	"invman.com/graphql/src/api/request/content"
	"invman.com/graphql/src/model"
)

type serviceApi struct {
	url string
}

type ServiceApi interface {
	GetService(id uint) (*model.ServiceModel, error)
	GetServiceList() ([]*model.ServiceModel, error)
	CreateService(name string) (*model.ServiceModel, error)
	UpdateService(name string) (*model.ServiceModel, error)
	// DeleteService()
}

func NewServiceApi() ServiceApi {
	return &serviceApi{
		url: "http://service-api:8080/v1",
	}
}

func (api *serviceApi) reflectBody(body io.ReadCloser, value any) error {
	defer body.Close()
	return json.NewDecoder(body).Decode(&value)
}

func (api *serviceApi) GetService(id uint) (*model.ServiceModel, error) {
	endpoint := fmt.Sprintf("/services/%d", id)
	body, err := api.get(endpoint)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := api.reflectBody(body, &service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) GetServiceList() ([]*model.ServiceModel, error) {
	// TODO add page param
	endpoint := "/services"
	body, err := api.get(endpoint)

	if err != nil {
		return nil, err
	}

	var serviceList []*model.ServiceModel

	if err := api.reflectBody(body, &serviceList); err != nil {
		return nil, err
	}

	return serviceList, nil
}

func (api *serviceApi) CreateService(name string) (*model.ServiceModel, error) {
	endpoint := "/services"
	content := content.CreateServiceContent{
		Name: name,
	}

	body, err := api.post(endpoint, content)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := api.reflectBody(body, &service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) UpdateService(name string) (*model.ServiceModel, error) {
	endpoint := "/services"
	content := content.CreateServiceContent{
		Name: name,
	}

	body, err := api.post(endpoint, content)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := api.reflectBody(body, &service); err != nil {
		return nil, err
	}

	return &service, nil
}
