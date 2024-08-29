package entity

import (
	"container/list"
	"errors"
	"time"

	"github.com/DanielHGim/shrek-run/api/src/config/env"
	"github.com/gorilla/websocket"
)

type Client struct {
	Position            uint8
	WebsocketConnection *websocket.Conn
}

type Party struct {
	Code      string
	Password  string
	AutoStart bool
	AdminCode string
	Clients   *list.List
	Timer     *time.Timer
	Started   bool
}

func NewParty(code string, password string, autoStart bool, timer *time.Timer, adminCode string) *Party {
	party := &Party{
		Code:      code,
		Password:  password,
		AutoStart: autoStart,
		AdminCode: adminCode,
		Clients:   list.New(),
		Timer:     timer,
		Started:   false,
	}
	if autoStart {
		go party.waitToStart()
	}
	return party
}

func (party *Party) waitToStart() {
	<-party.Timer.C
	party.Start()
}

func (party *Party) Start() {
	party.Started = true
	for item := party.Clients.Front(); item != nil; item = item.Next() {
		conn := item.Value.(Client).WebsocketConnection
		conn.SetWriteDeadline(time.Now().Add(time.Second * env.WriteTimeout))
		conn.WriteMessage(websocket.TextMessage, []byte("start"))
		conn.WriteMessage(websocket.CloseMessage, nil)
		conn.Close()
	}
}

func (party *Party) IsJoinable(password string, position uint8) error {
	if party.Password != password {
		return errors.New("wrong password")
	}

	isPositionOccupied := false
	for connection := party.Clients.Front(); connection != nil; connection.Next() {
		if connection.Value.(Client).Position == position {
			isPositionOccupied = true
			break
		}
	}
	if isPositionOccupied {
		return errors.New("position occupied")
	}

	if party.Started {
		return errors.New("party already started")
	}

	return nil
}

func (party *Party) Join(conn *websocket.Conn, password string, position uint8, timeToStart time.Duration) error {
	if err := party.IsJoinable(password, position); err != nil {
		return err
	}

	client := Client{Position: position, WebsocketConnection: conn}
	party.Clients.PushBack(client)

	if party.AutoStart {
		party.Timer.Reset(timeToStart)
	}

	return nil
}
