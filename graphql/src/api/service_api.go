package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"invman.com/graphql/src/model"
)

type serviceApi struct {
}

type ServiceApi interface {
	GetService(id uint) (*model.ServiceModel, error)
	GetServiceList() ([]*model.ServiceModel, error)
	CreateService(name string) (*model.ServiceModel, error)
	// UpdateService()
	// DeleteService()
}

func NewServiceApi() ServiceApi {
	return &serviceApi{}
}

func (api serviceApi) GetService(id uint) (*model.ServiceModel, error) {
	URL := fmt.Sprintf("http://service-api:8080/v1/services/%d", id)
	resp, err := http.Get(URL)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := json.NewDecoder(resp.Body).Decode(&service); err != nil {
		log.Fatal("Decoding error")
		return nil, err
	}

	return &service, nil
}

func (api serviceApi) GetServiceList() ([]*model.ServiceModel, error) {
	// TODO add page param
	URL := "http://service-api:8080/v1/services"
	resp, err := http.Get(URL)

	if err != nil {
		log.Fatal("Network error")
		return nil, err
	}

	var serviceList []*model.ServiceModel

	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&serviceList); err != nil {
		log.Fatal("Decoding error")
		return nil, err
	}

	return serviceList, nil
}

func (api serviceApi) CreateService(name string) (*model.ServiceModel, error) {
	URL := "http://service-api:8080/v1/services"
	content := fmt.Sprintf(`{"name": "%s"}`, name)

	resp, err := http.Post(URL, "application/json", bytes.NewBufferString(content))

	log.Default().Println(resp)

	if err != nil {
		return nil, err
	}

	var service model.ServiceModel

	if err := json.NewDecoder(resp.Body).Decode(&service); err != nil {
		log.Fatal("Decoding error")
		return nil, err
	}

	return &service, nil
}
