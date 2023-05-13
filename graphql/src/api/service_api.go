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
	GetService(id uint) (*model.Service, error)
	GetServiceList(cursor *string, maxResults *int) ([]*model.Service, error)
	CreateService(name string) (*model.Service, error)
	UpdateService(id uint, name string) (*model.Service, error)
	DeleteService(id uint) error
}

func NewServiceApi() ServiceApi {
	return &serviceApi{
		url: "http://service-api:8080/v1",
	}
}

func (api *serviceApi) GetService(id uint) (*model.Service, error) {
	url := fmt.Sprintf("%s/services/%d", api.url, id)

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Get(url)

	if err != nil {
		return nil, err
	}

	var service model.Service

	if err := response.MapBodyTo(&service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) GetServiceList(cursor *string, maxResults *int) ([]*model.Service, error) {
	url := fmt.Sprintf("%s/services", api.url)

	request := http.NewRequest().SetHeader("Content-Type", "application/json")

	if cursor != nil {
		request.AddQueryParam("cursor", *cursor)
	}

	if maxResults != nil {
		request.AddQueryParam("max_results", fmt.Sprint(*maxResults))
	}

	response, err := request.Get(url)

	if err != nil {
		return nil, err
	}

	var serviceList []*model.Service

	if err := response.MapBodyTo(&serviceList); err != nil {
		return nil, err
	}

	return serviceList, nil
}

func (api *serviceApi) CreateService(name string) (*model.Service, error) {
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

	var service model.Service

	if err := response.MapBodyTo(&service); err != nil {
		return nil, err
	}

	return &service, nil
}

func (api *serviceApi) UpdateService(id uint, name string) (*model.Service, error) {
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

	var service model.Service

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
