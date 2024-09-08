import { useSearchParams } from "react-router-dom";

export function useURLParams() {
    const [ searchParams, setSearchParams ] = useSearchParams();

    function getParams() {
        const params = {
            party: searchParams.get("party"),
            position: searchParams.get("pos"),
            password: searchParams.get("pswrd"),
            startAutomatically: (searchParams.get("auto") || "") == "true"
        }
        
        return params
    }

    function setParams(party, position, password, startAutomatically) {
        const params = {}

        if (party && party.length > 0) {
            params["party"] = party
        }

        if (position && position.length > 0) {
            params["pos"] = position
        }

        if (password && password.length > 0) {
            params["pswrd"] = password
        }

        if (startAutomatically) {
            params["auto"] = startAutomatically
        }

        setSearchParams(params)
    }

    return [ getParams, setParams ]
}
