package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/DanielHGim/shrek-run/api/src/controller/dto"
	"github.com/DanielHGim/shrek-run/api/src/service"
	"github.com/gorilla/websocket"
)

func CreateParty(w http.ResponseWriter, r *http.Request) {
	var request dto.PartyCreationRequest
	if err := getBody(r, &request); err != nil {
		respond(http.StatusBadRequest, nil, w)
		log.Println(err)
		return
	}

	partyCode, adminCode, err := service.CreateParty(request.Code, request.Password, request.AutoStart)
	if err != nil {
		respond(http.StatusConflict, nil, w)
		log.Println(err)
		return
	}

	response := dto.PartyCreationResponse{PartyCode: partyCode, AdminCode: adminCode}
	respond(http.StatusCreated, response, w)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func ConnectToParty(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		respond(http.StatusInternalServerError, nil, w)
		log.Println(err)
		return
	}

	pos := getQueryParam("pos", r)
	partyCode := getPathParam("id", r)
	password := getQueryParam("password", r)

	if pos == "" || partyCode == "" {
		conn.WriteMessage(websocket.CloseUnsupportedData, nil)
		return
	}

	position, err := strconv.ParseUint(pos, 10, 8)
	if err != nil {
		conn.WriteMessage(websocket.CloseUnsupportedData, nil)
		return
	}

	err = service.JoinParty(partyCode, password, uint8(position), conn)
	if err != nil {
		json, err := json.Marshal(dto.Event{Error: err.Error()})
		if err != nil {
			conn.WriteMessage(websocket.CloseInternalServerErr, nil)
			log.Println(err)
			return
		}

		conn.WriteMessage(websocket.ClosePolicyViolation, json)
		return
	}
}

func StartParty(w http.ResponseWriter, r *http.Request) {
	partyCode := getPathParam("id", r)

	var request dto.PartyStartRequest
	if err := getBody(r, &request); err != nil || request.AdminCode == "" {
		respond(http.StatusBadRequest, nil, w)
		log.Println(err)
		return
	}

	if err := service.StartParty(partyCode, request.AdminCode); err != nil {
		switch err.Error() {
		case "unauthorized":
			respond(http.StatusUnauthorized, err.Error(), w)
		default:
			respond(http.StatusNotFound, err.Error(), w)
		}
	}

}
