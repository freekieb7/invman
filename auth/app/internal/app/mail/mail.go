package mail

import (
	go_mail "github.com/go-mail/mail"
)

type Mail struct {
	From    string
	To      string
	Subject string
	Body    string
}

func Send(mail *Mail) error {
	m := go_mail.NewMessage()
	m.SetHeader("From", mail.From)
	m.SetHeader("To", mail.To)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/html", mail.Body)
	d := go_mail.NewDialer("mail.invman.nl", 587, "no-reply@invman.nl", "Uwv123")

	return d.DialAndSend(m)
}
