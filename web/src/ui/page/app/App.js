import './App.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createParty, connectToParty } from '../../../api/party'
import { useNavigate } from 'react-router-dom'
import { useURLParams } from '../../../router/params'
import { useConnectionStore } from '../../../state/connection'
import Input from '../../component/input/Input'
import Button from '../../component/button/Button'
import Selector from '../../component/selector/Selector'
import { showError } from '../../callable/toast/toast'

function App() {
    const [ getParams, setParams ] = useURLParams()
    const setConnection = useConnectionStore((state) => state.set)
    const navigate = useNavigate()

    const [ party, setParty ] = useState("")
    const [ position, setPosition ] = useState("1")
    const [ password, setPassword ] = useState("")
    const [ isToStartAutomatically, setIsToStartAutomatically ] = useState("")

    const isTryingToStartParty = useRef(false)

    const startParty = useCallback(async () => {
        if (!isTryingToStartParty.current) {
            isTryingToStartParty.current = true

            let partyCode = party
            let adminCode = null

            createParty(party, password, isToStartAutomatically === "Yes")
                .then(data => {
                    adminCode = data['admin-code']
                    setParty(data['party-code'])
                    partyCode = data['party-code']
                })
                .catch(() => console.log("couldn't create party"))
                .finally(() => {
                    if (partyCode && partyCode.trim() !== "") {
                        const ws = connectToParty(partyCode, position, password)
                        if (ws.readyState !== ws.CLOSING && ws.readyState !== ws.CLOSED) {
                            setConnection(ws)
                            navigate("/party", { state: { position, adminCode } })
                        }
                        else {
                            showError('Error trying to join the party.')
                        }
                    }
                    isTryingToStartParty.current = false
                })
        }
    }, [party, position, password, isToStartAutomatically, navigate])

    useEffect(() => {
        const params = getParams()

        if (params.party && party !== params.party) {
            setParty(params.party)
        }
        if (params.position && position !== params.position) {
            setPosition(params.position)
        }
        if (params.password && password !== params.password) {
            setPassword(params.password)
        }
        if (params.startAutomatically && isToStartAutomatically !== params.startAutomatically) {
            setIsToStartAutomatically(params.startAutomatically ? "Yes" : "No")
        }
    }, [])

    useEffect(() =>
        setParams(party, position, password, isToStartAutomatically === "Yes"),
        [party, position, password, isToStartAutomatically]
    )

    return (
        <div className="App">
            <div className="flex-col min-h-screen content-center">
                <div className="flex justify-around pb-5">
                    <Input
                        label="Party"
                        inputValue={party}
                        onChangeInput={setParty}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Input
                        label="Position"
                        inputValue={position}
                        onChangeInput={setPosition}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Input
                        label="Password"
                        inputValue={password}
                        onChangeInput={setPassword}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Selector
                        label="Start automatically"
                        options={["No", "Yes"]}
                        selectedOption={isToStartAutomatically}
                        onChange={setIsToStartAutomatically}
                    />
                </div>
                <div className="flex justify-around">
                    <Button onClick={startParty}>
                        Create/Join Party
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default App;
