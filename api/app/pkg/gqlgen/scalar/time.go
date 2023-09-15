package scalar

import (
	"errors"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

const MyTimeFormat = "15:04:05"

func MarshalTime(t time.Time) graphql.Marshaler {
	if t.IsZero() {
		return graphql.Null
	}

	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(t.Format(MyTimeFormat)))
	})
}

func UnmarshalTime(v interface{}) (time.Time, error) {
	if tmpStr, ok := v.(string); ok {
		return time.Parse(MyTimeFormat, tmpStr)
	}
	return time.Time{}, errors.New("time should be RFC3339 formatted string")
}
