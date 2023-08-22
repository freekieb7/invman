package controller

import (
	"html/template"
	httpHelper "invman/auth/internal/app/http"
	"invman/auth/internal/app/mail"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/session"
	"net/http"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type authController struct {
	templateServer *template.Template
	repository     *repository.Repository
}

func newAuthController(templateServer *template.Template, repository *repository.Repository) *authController {
	return &authController{
		templateServer: templateServer,
		repository:     repository,
	}
}

func (controller *authController) GetSignup(response http.ResponseWriter, request *http.Request) {
	controller.templateServer.ExecuteTemplate(response, "signup.html", nil)
}

func (controller *authController) PostSignup(response http.ResponseWriter, request *http.Request) {
	type form struct {
		Email    string `validate:"required,email"`
		Username string `validate:"required,min=3,max=20"`
		Password string `validate:"required,min=6,max=20"`
	}

	f := &form{
		Email:    request.PostFormValue("email"),
		Username: request.PostFormValue("username"),
		Password: request.PostFormValue("password"),
	}

	err := validator.New().Struct(f)

	if err != nil {
		httpHelper.ErrorResponse(response, "Internal server error occurred", http.StatusBadRequest)
		return
	}

	// passwordHash, err := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)

	mail.SendTest()

	if err != nil {
		httpHelper.ErrorResponse(response, "Internal server error occurred", http.StatusInternalServerError)
		return
	}

	// if err := controller.repository.Account.Create(repository.AccountCreateInput{
	// 	Email:        f.Email,
	// 	Username:     f.Username,
	// 	PasswordHash: string(passwordHash),
	// }); err != nil {
	// 	response.WriteHeader(http.StatusInternalServerError)
	// 	return
	// }

	http.Redirect(response, request, "/signin", http.StatusFound)
}

func (controller *authController) GetSignin(response http.ResponseWriter, request *http.Request) {
	controller.templateServer.ExecuteTemplate(response, "signin.html", nil)
}

func (controller *authController) PostSignin(response http.ResponseWriter, request *http.Request) {
	type form struct {
		Email    string `validate:"required,email"`
		Password string `validate:"required"`
	}

	f := &form{
		Email:    request.PostFormValue("email"),
		Password: request.PostFormValue("password"),
	}

	err := validator.New().Struct(f)

	if err != nil {
		httpHelper.ErrorResponse(response, "Invalid data received", http.StatusBadRequest)
		return
	}

	uuid, err := controller.repository.Account.GetUUIDByEmail(f.Email)

	if err != nil {
		httpHelper.ErrorResponse(response, "Credentials are incorrect", http.StatusNotFound)
		return
	}

	account, err := controller.repository.Account.Get(uuid)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(f.Password)); err != nil {
		httpHelper.ErrorResponse(response, "Credentials are incorrect", http.StatusNotFound)
		return
	}

	if !account.Verified {
		httpHelper.ErrorResponse(response, "Verify your email before proceeding", http.StatusExpectationFailed)
		return
	}

	session := session.From(request)

	if err := session.SetUserID(uuid); err != nil {
		httpHelper.ErrorResponse(response, "Internal server error occurred", http.StatusInternalServerError)
		return
	}

	http.Redirect(response, request, "/authorize", http.StatusFound)
}

func (controller *authController) GetAuthorize(response http.ResponseWriter, request *http.Request) {
	if _, ok := session.From(request).GetUserID(); !ok {
		http.Redirect(response, request, "/signin", http.StatusFound)
		return
	}

	controller.templateServer.ExecuteTemplate(response, "authorize.html", nil)
}

func (controller *authController) PostAuthorize(response http.ResponseWriter, request *http.Request) {
	session := session.From(request)

	if _, ok := session.GetUserID(); !ok {
		response.WriteHeader(http.StatusForbidden)
		return
	}

	// We take a POST as an granted agreement
	granted := true

	if err := session.SetAuthorizeGranted(granted); err != nil {
		httpHelper.ErrorResponse(response, "Internal server error occurred", http.StatusInternalServerError)
		return
	}

	controller.templateServer.ExecuteTemplate(response, "authorize.html", nil)
}
