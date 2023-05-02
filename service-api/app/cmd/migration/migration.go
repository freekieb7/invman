package migration

import (
	"invman.com/service-api/src/db"
	"invman.com/service-api/src/model"
)

func main() {
	db.NewPool().AutoMigrate(&model.Service{})
}
