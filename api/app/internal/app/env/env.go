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

func GetUint8(key string, fallback uint8) uint8 {
	val := os.Getenv(key)

	if val == "" {
		return fallback
	}

	u8, err := strconv.ParseUint(val, 10, 8)

	if err != nil {
		return fallback
	}

	return uint8(u8)
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
