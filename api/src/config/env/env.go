package env

import (
	"os"
	"strconv"
	"time"
)

var (
	WriteTimeout uint64 = 10
	CodeLenght uint64 = 6
	TimeToStart = time.Second * 5
	AllowedOrigins = "*"
)

func Init() {
	env := os.Getenv("WRITE-TIMEOUT")
	if env != "" {
		if v, err := strconv.ParseUint(env, 10, 64); err != nil {
			WriteTimeout = v
		}
	}

	env = os.Getenv("CODE-LENGHT")
	if env != "" {
		if v, err := strconv.ParseUint(env, 10, 64); err != nil {
			CodeLenght = v
		}
	}

	env = os.Getenv("TIME-TO-START")
	if env != "" {
		if v, err := strconv.ParseInt(env, 10, 64); err != nil {
			TimeToStart = time.Duration(v) * time.Second
		}
	}

	if v := os.Getenv("ALLOWED-ORIGINS"); v != "" {
		AllowedOrigins = v
	}
}
