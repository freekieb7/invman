package controller

type Controller struct {
	Service interface{ ServiceController }
}
