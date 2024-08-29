package service

import (
	"errors"
	"math/rand"
	"time"

	"github.com/DanielHGim/shrek-run/api/src/config/env"
	"github.com/DanielHGim/shrek-run/api/src/entity"
	"github.com/DanielHGim/shrek-run/api/src/storage"
	"github.com/gorilla/websocket"
)

const (
	codeCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func generateRandomString(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = codeCharset[seededRand.Intn(len(codeCharset))]
	}
	return string(b)
}

// return format: party code, admin code, error
func CreateParty(code string, password string, autoStart bool) (string, string, error) {
	if code != "" {
		if storage.GetPartyByCode(code) != nil {
			return "", "", errors.New("party already exist")
		}
	} else {
		code = generateRandomString(6)
	}

	adminCode := generateRandomString(6)

	var timer *time.Timer
	if autoStart {
		timer = time.NewTimer(env.TimeToStart)
	}

	party := entity.NewParty(code, password, autoStart, timer, adminCode)
	storage.SaveParty(party)
	return code, adminCode, nil
}

func GetParty(partyCode string) *entity.Party {
	return storage.GetPartyByCode(partyCode)
}

func IsPartyJoinable(partyCode string, password string, position uint8) error {
	party := GetParty(partyCode)
	if party == nil {
		return errors.New("not found")
	}

	return party.IsJoinable(password, position)
}

func JoinParty(partyCode string, password string, position uint8, conn *websocket.Conn) error {
	party := GetParty(partyCode)
	if party == nil {
		return errors.New("not found")
	}

	return party.Join(conn, password, position, env.TimeToStart)
}

func StartParty(partyCode string, adminCode string) error {
	party := GetParty(partyCode)
	if party == nil {
		return errors.New("not found")
	}

	if party.AdminCode != adminCode {
		return errors.New("unauthorized")
	}

	if !party.Started {
		party.Start()
	}

	return nil
}
