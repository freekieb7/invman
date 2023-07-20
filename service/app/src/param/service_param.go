package param

type GetServiceListParams struct {
	MaxResults int    `json:"page_size" binding:"required"`
	Cursor     string `json:"pagination_token"`
}
