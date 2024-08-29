package dto

type PartyCreationRequest struct {
	Code      string `json:"code"`
	Password  string `json:"password"`
	AutoStart bool   `json:"auto-start"`
}

type PartyCreationResponse struct {
	PartyCode string `json:"party-code"`
	AdminCode string `json:"admin-code,omitempty"`
}

type PartyStartRequest struct {
	AdminCode string `json:"admin-code"`
}
