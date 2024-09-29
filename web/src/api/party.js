import axios from "axios";
import { createPartyURL, connectToPartyURL, startPartyURL } from "../config/env";

export async function createParty(code, password, autoStart) {
    return (await axios.post(createPartyURL(), {
        "code": code,
        "password": password,
        "auto-start": autoStart
    })).data
}

export function connectToParty(code, position, password) {
    const ws = new WebSocket(connectToPartyURL(code, position, password))
    return ws
}

export async function startParty(code, adminCode) {
    return (await axios.post(startPartyURL(code), {
        "admin-code": adminCode
    })).data
}
