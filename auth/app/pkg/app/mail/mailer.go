package mail

import (
	"invman/auth/internal/app/config"

	go_mail "github.com/go-mail/mail"
)

type Mailer struct {
	config config.MailConfig
}

func NewMailer(config config.MailConfig) *Mailer {
	return &Mailer{
		config: config,
	}
}

type Mail struct {
	From    string
	To      string
	Subject string
	Body    string
}

func (mailer *Mailer) Send(mail Mail) error {
	m := go_mail.NewMessage()
	m.SetHeader("From", mail.From)
	m.SetHeader("To", mail.To)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/html", mail.Body)
	d := go_mail.NewDialer("mail.invman.nl", 587, mailer.config.Username, mailer.config.Password)

	return d.DialAndSend(m)
}
