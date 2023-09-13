package controller

import (
	"net/http"
)

type FileController struct {
	fs http.FileSystem
}

func NewFileController(fs http.FileSystem) *FileController {
	return &FileController{
		fs: fs,
	}
}

func (controller *FileController) GetPublicFile(response http.ResponseWriter, request *http.Request) {
	http.FileServer(controller.fs).ServeHTTP(response, request)
}
