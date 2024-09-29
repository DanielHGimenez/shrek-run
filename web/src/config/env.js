import queryString from "query-string";

export function host() {
    return process.env.API_HOST || 'shrek-run-api.fly.dev'
}

export function http() {
    return 'https://'
}

export const createPartyURL = () => http() + host() + '/party'

export function connectToPartyURL(code, position, password) {
    return 'wss://' + host() + '/party/' + code + '/member?'
        + queryString.stringify(
            {
                pos: position,
                password: password
            },
            {
                skipEmptyString: true,
                skipNull: true
            }
        )
}

export const startPartyURL = (code) => http() + host() + '/party/' + code + '/joy'
