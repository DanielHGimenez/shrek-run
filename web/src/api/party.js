import axios from "axios";
import { createPartyURL, connectToPartyURL } from "../config/env";

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
