package api

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	api_request "invman.com/graphql/src/api/request"
	api_response "invman.com/graphql/src/api/response"
	"invman.com/graphql/src/http"
)

type serviceApi struct {
	url string
}

type ServiceApi interface {
	GetService(uuid uuid.UUID) (*api_response.GetService, error)
	GetServiceList(cursor *string, maxResults *int) (*api_response.GetServices, error)
	CreateService(name string) (*api_response.GetService, error)
	UpdateService(uuid uuid.UUID, name string) (*api_response.GetService, error)
	DeleteService(uuid uuid.UUID) error
}

func NewServiceApi() ServiceApi {
	return &serviceApi{
		url: "http://service-api:8080/v1",
	}
}

func (api *serviceApi) GetService(uuid uuid.UUID) (*api_response.GetService, error) {
	url := fmt.Sprintf("%s/services/%s", api.url, uuid.String())

	response, err := http.NewRequest().SetHeader("Content-Type", "application/json").Get(url)

	if err != nil {
		return nil, err
	}

	var getService api_response.GetService

	if err := response.MapBodyTo(&getService); err != nil {
		return nil, err
	}

	return &getService, nil
}

func (api *serviceApi) GetServiceList(cursor *string, maxResults *int) (*api_response.GetServices, error) {
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

	var getServices api_response.GetServices

	if err := response.MapBodyTo(&getServices); err != nil {
		return nil, err
	}

	return &getServices, nil
}

func (api *serviceApi) CreateService(name string) (*api_response.GetService, error) {
	url := fmt.Sprintf("%s/services", api.url)
	content := api_request.CreateService{
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

	var getService api_response.GetService

	if err := response.MapBodyTo(&getService); err != nil {
		return nil, err
	}

	return &getService, nil
}

func (api *serviceApi) UpdateService(uuid uuid.UUID, name string) (*api_response.GetService, error) {
	url := fmt.Sprintf("%s/services/%s", api.url, uuid.String())
	content := api_request.UpdateService{
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

	var getService api_response.GetService

	if err := response.MapBodyTo(&getService); err != nil {
		return nil, err
	}

	return &getService, nil
}

func (api *serviceApi) DeleteService(uuid uuid.UUID) error {
	url := fmt.Sprintf("%s/services/%s", api.url, uuid.String())

	_, err := http.NewRequest().SetHeader("Content-Type", "application/json").Delete(url)

	return err
}
