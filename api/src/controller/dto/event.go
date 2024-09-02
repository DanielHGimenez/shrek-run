package dto

type Event struct {
	Error string `json:"error,omitempty"`
	Data EventData `json:"data,omitempty"`
}

type EventData struct {
	Members uint8 `json:"members,omitempty"`
	Start bool `json:"start,omitempty"`
}
