package request

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

type request struct {
	http
}

func (r *request) get(endpoint string) (io.ReadCloser, error) {
	url := fmt.Sprintf("%s%s", api.url, endpoint)
	resp, err := http.Get(url)

	if err != nil {
		return nil, err
	}

	switch resp.StatusCode {
	case 200:
		return resp.Body, nil
	default:
		fmt.Sprintln("Unhandled request status")
		return nil, errors.New("unexpected result")
	}
}

func (api *request) post(endpoint string, content any) (io.ReadCloser, error) {
	client := &http.Client{}

	url := fmt.Sprintf("%s%s", api.url, endpoint)
	jcontent, err := json.Marshal(content)

	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(jcontent))
	req.Header.Set("Content-Type", "application/json")

	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	return resp.Body, nil
}

func (api *request) put(url string, content any) (io.ReadCloser, error) {
	client := &http.Client{}

	jcontent, err := json.Marshal(content)

	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(jcontent))
	req.Header.Set("Content-Type", "application/json")

	if err != nil {
		return nil, err
	}

	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	return resp.Body, nil
}
