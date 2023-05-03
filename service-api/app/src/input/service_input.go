package input

type CreateServiceInput struct {
	Name string `json:"name" binding:"required"`
}

type UpdateServiceInput struct {
	Name string `json:"name" binding:"required"`
}
