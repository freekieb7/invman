package dependencies

import (
	"invman/auth/internal/app/config"
	"invman/auth/pkg/app/datasource/database"
	"invman/auth/pkg/app/datasource/redis"
	"invman/auth/pkg/app/http/controller"
	mailer "invman/auth/pkg/app/mail"
	"invman/auth/pkg/app/repository"
	"invman/auth/pkg/oauth2"
	"net/http"
)

type Dependencies struct {
	Database                 *database.Database
	Redis                    *redis.Redis
	FileController           *controller.FileController
	MetricsController        *controller.MetricsController
	AuthenticationController *controller.AuthenticationController
	RegistrationController   *controller.RegistrationController
	PasswordController       *controller.PasswordController
	OAuthController          *controller.OAuthController
}

func New() *Dependencies {
	config := config.New()

	// Datasources
	database := database.New(config.Db)
	redis := redis.New(config.Redis)

	// Mailer
	mailer := mailer.NewMailer(config.Mail)

	// Repository
	accountRepository := repository.NewAccountRepository(database, redis)
	companyRepository := repository.NewCompanyRepository(database)

	// Service
	oauth2Service := oauth2.New(config.OAuth, config.Redis)

	// Page controllers
	fileController := controller.NewFileController(http.Dir("web/public"))
	metricsController := controller.NewMetricsController()
	authenticationController := controller.NewAuthenticationController(
		accountRepository,
	)
	registrationController := controller.NewRegistrationController(
		config.Server,
		redis,
		database,
		mailer,
		companyRepository,
		accountRepository,
	)
	passwordController := controller.NewPasswordController(
		config.Server,
		redis,
		mailer,
		accountRepository,
	)
	oAuthController := controller.NewOAuthController(
		oauth2Service,
		accountRepository,
	)

	return &Dependencies{
		Database:                 database,
		Redis:                    redis,
		FileController:           fileController,
		MetricsController:        metricsController,
		AuthenticationController: authenticationController,
		RegistrationController:   registrationController,
		PasswordController:       passwordController,
		OAuthController:          oAuthController,
	}
}
