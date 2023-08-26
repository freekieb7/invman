package controller

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"html/template"
	"invman/auth/internal/app/database"
	httpHelper "invman/auth/internal/app/http"
	"invman/auth/internal/app/mail"
	"invman/auth/internal/app/repository"
	"invman/auth/internal/app/session"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type signController struct {
	templater  *template.Template
	repository *repository.Repository
}

func newSignController(templater *template.Template, repository *repository.Repository) *signController {
	return &signController{
		templater:  templater,
		repository: repository,
	}
}

type PageInfo struct {
	Title string
	Error string
}

func (controller *signController) GetSignup(response http.ResponseWriter, request *http.Request) {
	controller.templater.ExecuteTemplate(response, "signup.html", PageInfo{
		Title: "Sign up",
	})
}

func (controller *signController) GetSignupSuccess(response http.ResponseWriter, request *http.Request) {
	controller.templater.ExecuteTemplate(response, "signup_success.html", PageInfo{
		Title: "Almost there",
	})
}

func (controller *signController) PostSignup(response http.ResponseWriter, request *http.Request) {
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

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)

	if err != nil {
		httpHelper.ErrorResponse(response, "Internal server error occurred", http.StatusInternalServerError)
		return
	}

	if err := controller.repository.Database.Transaction(func() error {
		accountUuid := uuid.New()

		// TODO give better unique account error msg
		err := controller.repository.Account.Create(repository.AccountCreateInput{
			UUID:         accountUuid,
			Email:        f.Email,
			Username:     f.Username,
			PasswordHash: string(passwordHash),
		})

		if err != nil && err.Code() == database.ErrCodeUniqueViolation {
			return errors.New("account already exists")
		}

		// Email verification preperation
		buf := bytes.NewBufferString(accountUuid.String())
		buf.WriteString(f.Email)
		buf.WriteString(strconv.FormatInt(time.Now().UnixNano(), 10))

		verificationToken := base64.URLEncoding.EncodeToString([]byte(uuid.NewMD5(uuid.Must(uuid.NewRandom()), buf.Bytes()).String()))

		if err := controller.repository.Account.SetUUIDByVerificationToken(accountUuid, verificationToken); err != nil {
			return errors.New("internal server error")
		}

		ref := fmt.Sprintf("%s/verify?token=%s", "http://auth.localhost", verificationToken)

		var tpl bytes.Buffer
		if err := controller.templater.ExecuteTemplate(&tpl, "verification_mail.html", map[string]any{
			"username": f.Username,
			"ref":      ref,
		}); err != nil {
			return errors.New("internal server error")
		}

		m := &mail.Mail{
			From:    "no-reply@invman.nl",
			To:      f.Email,
			Subject: "Verify your Invman account",
			Body:    tpl.String(),
		}

		if err := mail.Send(m); err != nil {
			return errors.New("server failed to send verification email")
		}

		return nil
	}); err != nil {
		httpHelper.ErrorResponse(response, err.Error(), http.StatusInternalServerError)
		return
	}

	http.Redirect(response, request, "/signup/success", http.StatusFound)
}

func (controller *signController) GetSignin(response http.ResponseWriter, request *http.Request) {
	controller.templater.ExecuteTemplate(response, "signin.html", PageInfo{
		Title: "Sign in",
	})
}

func (controller *signController) PostSignin(response http.ResponseWriter, request *http.Request) {
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

func (controller *signController) GetAuthorize(response http.ResponseWriter, request *http.Request) {
	if _, ok := session.From(request).GetUserID(); !ok {
		http.Redirect(response, request, "/signin", http.StatusFound)
		return
	}

	controller.templater.ExecuteTemplate(response, "authorize.html", PageInfo{
		Title: "Authorize",
	})
}

func (controller *signController) GetVerify(response http.ResponseWriter, request *http.Request) {
	type form struct {
		Token string `validate:"required"`
	}

	f := &form{
		Token: request.URL.Query().Get("token"),
	}

	err := validator.New().Struct(f)

	if err != nil {
		controller.templater.ExecuteTemplate(response, "verify_failed.html", PageInfo{
			Title: "Email not failed",
			Error: "Verification token is invalid, please retry",
		})
		return
	}

	uuid, err := controller.repository.Account.GetUUIDByVerificationToken(f.Token)

	if err != nil {
		controller.templater.ExecuteTemplate(response, "verify_failed.html", PageInfo{
			Title: "Email not failed",
			Error: "Verification token is invalid, please retry",
		})
		return
	}

	account, dbErr := controller.repository.Account.Get(uuid)

	if dbErr != nil {
		controller.templater.ExecuteTemplate(response, "verify_failed.html", PageInfo{
			Title: "Email not failed",
			Error: "An internal server error occurred",
		})
		return
	}

	if account.Verified {
		controller.templater.ExecuteTemplate(response, "verify_success.html", PageInfo{
			Title: "Email verified",
		})
		return
	}

	if err := controller.repository.Account.UpdateVerified(account.UUID, true); err != nil {
		controller.templater.ExecuteTemplate(response, "verify_failed.html", PageInfo{
			Title: "Email not failed",
			Error: "An internal server error occurred",
		})
		return
	}

	controller.templater.ExecuteTemplate(response, "verify_success.html", PageInfo{
		Title: "Email verified",
	})
}
