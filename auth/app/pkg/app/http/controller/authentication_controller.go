package controller

import (
	"errors"
	"invman/auth/pkg/app/http/render"
	"invman/auth/pkg/app/http/session"
	"invman/auth/pkg/app/http/template"
	"invman/auth/pkg/app/repository"
	"net/http"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type AuthenticationController struct {
	accountRepository *repository.AccountRepository
}

func NewAuthenticationController(accountRepository *repository.AccountRepository) *AuthenticationController {
	return &AuthenticationController{
		accountRepository: accountRepository,
	}
}

func (controller *AuthenticationController) ShowSignIn(response http.ResponseWriter, request *http.Request) {
	template.ServeHtml(response, "sign_in.html", nil)
}

func (controller *AuthenticationController) Signin(response http.ResponseWriter, request *http.Request) {
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
		render.ErrUnprocessableContent(response, errors.New("form validation failed"))
		return
	}

	account, err := controller.accountRepository.GetByEmail(f.Email)

	if err != nil {
		render.ErrNotFound(response, errors.New("credentials are incorrect"))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(f.Password)); err != nil {
		render.ErrNotFound(response, errors.New("credentials are incorrect"))
		return
	}

	session := session.From(request)

	if err := session.SetUserID(account.ID); err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}
}
