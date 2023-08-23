package mail

import (
	"crypto/tls"
	"errors"
	"log"
	"net"
	"net/smtp"
	"strings"
)

func SendTest() {
	log.Println("test mail")
	to := []string{"freekieb7@hotmail.com"}

	auth := smtp.PlainAuth("", "freek@invman.nl", "Ditiseenlangezin1!", "mail.invman.nl")

	log.Println("auth completed")

	err := smtp.SendMail("mail.invman.nl:587", auth, "freek@invman.nl", to, []byte("hi"))

	log.Println("send completed")

	if err != nil {
		log.Println(err)
	} else {
		log.Println("Success")
	}
}

func SendMailTLS(addr string, auth smtp.Auth, from string, to []string, msg []byte) error {
	host, _, err := net.SplitHostPort(addr)

	log.Println("a")

	if err != nil {
		return err
	}
	tlsconfig := &tls.Config{ServerName: host}

	log.Println("b")

	if err = validateLine(from); err != nil {
		return err
	}
	for _, recp := range to {
		if err = validateLine(recp); err != nil {
			return err
		}
	}
	conn, err := tls.Dial("tcp", addr, tlsconfig)

	log.Println("c")

	if err != nil {
		return err
	}
	defer conn.Close()
	c, err := smtp.NewClient(conn, host)

	log.Println("d")

	if err != nil {
		return err
	}
	defer c.Close()

	log.Println("e")

	if err = c.Hello("localhost"); err != nil {
		return err
	}

	log.Println("f")

	if err = c.Auth(auth); err != nil {
		return err
	}

	log.Println("g")

	if err = c.Mail(from); err != nil {
		return err
	}
	for _, addr := range to {
		if err = c.Rcpt(addr); err != nil {
			return err
		}
	}
	w, err := c.Data()

	log.Println("h")

	if err != nil {
		return err
	}
	_, err = w.Write(msg)

	log.Println("i")

	if err != nil {
		return err
	}
	err = w.Close()

	log.Println("j")

	if err != nil {
		return err
	}

	log.Println("k")

	return c.Quit()
}

// validateLine checks to see if a line has CR or LF as per RFC 5321
func validateLine(line string) error {
	if strings.ContainsAny(line, "\n\r") {
		return errors.New("a line must not contain CR or LF")
	}
	return nil
}
