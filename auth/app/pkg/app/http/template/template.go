package template

import (
	"fmt"
	"html/template"
	"io"
)

func ServeHtml(writer io.Writer, name string, data any) error {
	tmpl := template.Must(template.ParseFiles(fmt.Sprintf("web/template/%s", name), "web/template/layout.html"))
	return tmpl.ExecuteTemplate(writer, "layout", data)
}

func ServeMail(writer io.Writer, name string, data any) error {
	tmpl := template.Must(template.ParseFiles(fmt.Sprintf("mail/template/%s", name), "mail/template/layout.html"))
	return tmpl.ExecuteTemplate(writer, "layout", data)
}
