package api_response

import "time"

type GetServices struct {
	Data struct {
		Services []struct {
			UUID      string     `json:"uuid"`
			Name      string     `json:"name"`
			CreatedAt time.Time  `json:"created_at"`
			UpdatedAt time.Time  `json:"updated_at"`
			DeletedAt *time.Time `json:"deleted_at,omitempty"`
		} `json:"services"`
		NextCursor string `json:"next_cursor"`
	} `json:"data"`
}

type GetService struct {
	Data struct {
		Service struct {
			UUID      string     `json:"uuid"`
			Name      string     `json:"name"`
			CreatedAt time.Time  `json:"created_at"`
			UpdatedAt time.Time  `json:"updated_at"`
			DeletedAt *time.Time `json:"deleted_at,omitempty"`
		}
		NextCursor string `json:"next_cursor"`
	} `json:"data"`
}
