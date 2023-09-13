package controller

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"invman/auth/internal/app/config"
	"invman/auth/pkg/app/datasource/database"
	"invman/auth/pkg/app/datasource/database/entity"
	"invman/auth/pkg/app/datasource/redis"
	"invman/auth/pkg/app/http/render"
	"invman/auth/pkg/app/http/session"
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

type RegistrationController struct {
	serverConfig      config.ServerConfig
	redis             *redis.Redis
	database          *database.Database
	mailer            *mail.Mailer
	companyRepository *repository.CompanyRepository
	accountRepository *repository.AccountRepository
}

func NewRegistrationController(
	serverConfig config.ServerConfig,
	redis *redis.Redis,
	database *database.Database,
	mailer *mail.Mailer,
	companyRepository *repository.CompanyRepository,
	accountRepository *repository.AccountRepository,
) *RegistrationController {
	return &RegistrationController{
		serverConfig:      serverConfig,
		redis:             redis,
		database:          database,
		mailer:            mailer,
		companyRepository: companyRepository,
		accountRepository: accountRepository,
	}
}

type SignupTokenInfo struct {
	CompanyName string `json:"company_name"`
	Email       string `json:"email"`
	Firstname   string `json:"firstname"`
	Lastname    string `json:"lastname"`
	Password    string `json:"password"`
}

func (controller *RegistrationController) CompleteRegistration(response http.ResponseWriter, request *http.Request) {
	// Use signup token to retrieve pre-filled signup form
	signupToken := request.URL.Query().Get("t")

	tokenKey := fmt.Sprintf("su_token:%s", signupToken)
	tokenValue, err := controller.redis.Get(tokenKey)

	if err != nil {
		template.ServeHtml(response, "error.html", map[string]any{
			"error": "Verification could not be completed due to an invalid token, please redo the signup process",
		})
	}

	var tokenInfo SignupTokenInfo
	if err := json.Unmarshal([]byte(tokenValue), &tokenInfo); err != nil {
		template.ServeHtml(response, "error.html", map[string]any{
			"error": "Verification could not be completed due to an invalid token, please redo the signup process",
		})
		return
	}

	// Store the newly registered company
	newCompany := entity.Company{
		ID:   uuid.New(),
		Name: tokenInfo.CompanyName,
	}

	newAccount := entity.Account{
		ID:        uuid.New(),
		CompanyID: newCompany.ID,
		Email:     tokenInfo.Email,
		Password:  tokenInfo.Password,
		Firstname: tokenInfo.Firstname,
		Lastname:  tokenInfo.Lastname,
	}

	if err := controller.database.Transaction(func() error {
		if err := controller.companyRepository.Create(newCompany); err != nil {
			return err
		}

		return controller.accountRepository.Create(newAccount)
	}); err != nil {
		template.ServeHtml(response, "error.html", map[string]any{
			"error": "There are some unresolvable problems, please try again",
		})
	}

	// Cleanup
	controller.redis.Delete(tokenKey)

	// UserID is directly saved to skip sign in process
	session.From(request).SetUserID(newAccount.ID)

	// Go directly to app
	http.Redirect(response, request, controller.serverConfig.AppHost, http.StatusFound)
}

func (controller *RegistrationController) Register(response http.ResponseWriter, request *http.Request) {
	type form struct {
		CompanyName string `validate:"required,max=50"`
		Firstname   string `validate:"required,max=50"`
		Lastname    string `validate:"required,max=50"`
		Email       string `validate:"required,max=50,email"`
		Password    string `validate:"required,min=6,max=50"`
	}

	f := &form{
		CompanyName: request.PostFormValue("company_name"),
		Firstname:   request.PostFormValue("firstname"),
		Lastname:    request.PostFormValue("lastname"),
		Email:       request.PostFormValue("email"),
		Password:    request.PostFormValue("password"),
	}

	err := validator.New().Struct(f)

	if err != nil {
		render.ErrUnprocessableContent(response, errors.New("form validation failed"))
		return
	}

	// Remember demo request as token for later email confirmation
	signupToken := base64.URLEncoding.EncodeToString([]byte(uuid.NewMD5(uuid.Must(uuid.NewRandom()), []byte(
		fmt.Sprintf("%s;%s;%s", f.CompanyName, f.Email, strconv.FormatInt(time.Now().UnixNano(), 10)),
	)).String()))

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(f.Password), bcrypt.DefaultCost)

	tokenKey := fmt.Sprintf("su_token:%s", signupToken)
	tokenValue, _ := json.Marshal(&SignupTokenInfo{
		CompanyName: f.CompanyName,
		Email:       f.Email,
		Firstname:   f.Firstname,
		Lastname:    f.Lastname,
		Password:    string(passwordHash),
	})

	controller.redis.Set(tokenKey, string(tokenValue), time.Hour*24)

	var mailBody bytes.Buffer
	if err := template.ServeMail(&mailBody, "verify_registration.html", map[string]any{
		"company_name": f.CompanyName,
		"firstname":    f.Firstname,
		"ref":          fmt.Sprintf("%s/register?t=%s", controller.serverConfig.PublicHost, signupToken),
	}); err != nil {
		render.ErrInternalServerError(response, nil)
		return
	}

	if err := controller.mailer.Send(mail.Mail{
		From:    "Invman",
		To:      f.Email,
		Subject: "Complete registration",
		Body:    mailBody.String(),
	}); err != nil {
		render.ErrInternalServerError(response, errors.New("verification email could not be send"))
		return
	}
}
