import queryString from "query-string";

export function host() {
    return process.env.API_HOST || 'localhost:9000'
}

export const createPartyURL = () => 'http://' + host() + '/party'

export function connectToPartyURL(code, position, password) {
    return 'ws://' + host() + '/party/' + code + '/member?'
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
