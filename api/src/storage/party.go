package storage

import (
	"time"

	"github.com/DanielHGim/shrek-run/api/src/entity"
)

var (
	parties     map[string]*entity.Party
	cleanTicker *time.Ticker
)

func clear() {
	for {
		<-cleanTicker.C
		for key, party := range parties {
			if party.Started {
				DeleteParty(key)
			}
		}
	}
}

func Init() {
	parties = make(map[string]*entity.Party)
	cleanTicker = time.NewTicker(time.Second)
	go clear()
}

func SaveParty(party *entity.Party) {
	parties[party.Code] = party
}

func GetPartyByCode(code string) *entity.Party {
	return parties[code]
}

func DeleteParty(code string) {
	delete(parties, code)
}
