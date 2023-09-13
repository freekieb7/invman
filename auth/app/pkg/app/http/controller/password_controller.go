package controller

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"invman/auth/internal/app/config"
	"invman/auth/pkg/app/datasource/redis"
	"invman/auth/pkg/app/http/render"
	"invman/auth/pkg/app/http/template"
	"invman/auth/pkg/app/mail"
	"invman/auth/pkg/app/repository"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type PasswordController struct {
	serverConfig      config.ServerConfig
	redis             *redis.Redis
	mailer            *mail.Mailer
	accountRepository *repository.AccountRepository
}

func NewPasswordController(
	serverConfig config.ServerConfig,
	redis *redis.Redis,
	mailer *mail.Mailer,
	accountRepository *repository.AccountRepository,
) *PasswordController {
	return &PasswordController{
		serverConfig:      serverConfig,
		redis:             redis,
		mailer:            mailer,
		accountRepository: accountRepository,
	}
}

func (controller *PasswordController) ShowForgotPassword(response http.ResponseWriter, request *http.Request) {
	template.ServeHtml(response, "forgot_password.html", nil)
}

func (controller *PasswordController) ShowResetPassword(response http.ResponseWriter, request *http.Request) {
	template.ServeHtml(response, "reset_password.html", nil)
}

func (controller *PasswordController) ForgotPassword(response http.ResponseWriter, request *http.Request) {
	type form struct {
		Email string `validate:"required,email"`
	}

	f := &form{
		Email: request.PostFormValue("email"),
	}

	err := validator.New().Struct(f)

	if err != nil {
		render.ErrUnprocessableContent(response, errors.New("form validation failed"))
		return
	}

	exists, err := controller.accountRepository.ExistsEmail(f.Email)

	if err != nil {
		render.ErrUnprocessableContent(response, errors.New("something went wrong"))
	}

	if !exists {
		render.Success(response, "Please check you mail inbox")
	}

	// Setup reset procedure
	passwordResetToken := base64.URLEncoding.EncodeToString([]byte(uuid.NewMD5(uuid.Must(uuid.NewRandom()), []byte(
		fmt.Sprintf("%s;%s", f.Email, strconv.FormatInt(time.Now().UnixNano(), 10)),
	)).String()))

	tokenKey := fmt.Sprintf("rp_token:%s", passwordResetToken)

	controller.redis.Set(tokenKey, f.Email, time.Hour)

	var mailBody bytes.Buffer
	if err := template.ServeMail(&mailBody, "forgot_password.html", map[string]any{
		"ref": fmt.Sprintf("%s/signinoption/password/reset?t=%s", controller.serverConfig.PublicHost, passwordResetToken),
	}); err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}

	if err := controller.mailer.Send(mail.Mail{
		From:    "no-reply@invman.nl",
		To:      f.Email,
		Subject: "Forgot password",
		Body:    mailBody.String(),
	}); err != nil {
		render.ErrInternalServerError(response, errors.New("mail could not be send"))
		return
	}

	render.Success(response, "Please check you mail inbox")
}

func (controller *PasswordController) ResetPassword(response http.ResponseWriter, request *http.Request) {
	type form struct {
		Password string `validate:"required,min=6,max=50"`
	}

	f := &form{
		Password: request.PostFormValue("password"),
	}

	if err := validator.New().Struct(f); err != nil {
		render.ErrUnprocessableContent(response, errors.New("form validation failed"))
		return
	}

	resetPasswordToken := request.URL.Query().Get("t")

	if resetPasswordToken == "" {
		render.ErrUnprocessableContent(response, errors.New("missing token"))
	}

	tokenKey := fmt.Sprintf("rp_token:%s", resetPasswordToken)
	email, err := controller.redis.Get(tokenKey)

	if err != nil {
		if errors.Is(redis.ErrNotFound, err) {
			render.ErrUnprocessableContent(response, errors.New("invalid token received"))
		} else {
			render.ErrInternalServerError(response, nil)
		}
		return
	}

	if err := controller.redis.Delete(tokenKey); err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}

	account, err := controller.accountRepository.GetByEmail(email)

	if err != nil {
		render.ErrUnprocessableContent(response, errors.New("invalid token received"))
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)

	if err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}

	account.Password = string(passwordHash)

	if err := controller.accountRepository.Update(account); err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}

	render.Success(response, "Password has been reset")
}
