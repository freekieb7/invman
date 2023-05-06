package api

import (
	"encoding/json"
	"fmt"

	"invman.com/graphql/src/api/content"
	"invman.com/graphql/src/http"
	"invman.com/graphql/src/model"
)

type serviceApi struct {
	url string
}

type ServiceApi interface {
	GetService(id uint) (*model.ServiceModel, error)
	GetServiceList() ([]*model.ServiceModel, error)
	CreateService(name string) (*model.ServiceModel, error)
	UpdateService(id uint, name string) (*model.ServiceModel, error)
	DeleteService(id uint) error
}

func NewServiceApi() ServiceApi {
	return &serviceApi{
		url: "http://service-api:8080/v1",
	}
}

func (api *serviceApi) GetService(id uint) (*model.ServiceModel, error) {
	url := fmt.Sprintf("%s/services/%d", api.url, id)

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Get(url)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := response.MapBodyTo(&service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) GetServiceList() ([]*model.ServiceModel, error) {
	// TODO add page param
	url := fmt.Sprintf("%s/services", api.url)

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Get(url)

	if err != nil {
		return nil, err
	}

	var serviceList []*model.ServiceModel

	if err := response.MapBodyTo(&serviceList); err != nil {
		return nil, err
	}

	return serviceList, nil
}

func (api *serviceApi) CreateService(name string) (*model.ServiceModel, error) {
	url := fmt.Sprintf("%s/services", api.url)
	content := content.CreateServiceContent{
		Name: name,
	}

	bcontent, err := json.Marshal(content)

	if err != nil {
		return nil, err
	}

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Post(url, bcontent)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := response.MapBodyTo(&service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) UpdateService(id uint, name string) (*model.ServiceModel, error) {
	url := fmt.Sprintf("%s/services/%d", api.url, id)
	content := content.UpdateServiceContent{
		Name: name,
	}

	bcontent, err := json.Marshal(content)

	if err != nil {
		return nil, err
	}

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Put(url, bcontent)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := response.MapBodyTo(&service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) DeleteService(id uint) error {
	url := fmt.Sprintf("%s/services/%d", api.url, id)

	_, err := http.NewRequest().SetHeader("Content-Type", "application/json").Delete(url)

	return err
}
