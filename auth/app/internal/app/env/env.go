package env

import (
	"os"
	"strconv"
)

func GetString(key string, fallback string) string {
	val := os.Getenv(key)

	if val == "" {
		return fallback
	}

	return val
}

func GetUint16(key string, fallback uint16) uint16 {
	val := os.Getenv(key)

	if val == "" {
		return fallback
	}

	u16, err := strconv.ParseUint(val, 10, 16)

	if err != nil {
		return fallback
	}

	return uint16(u16)
}
