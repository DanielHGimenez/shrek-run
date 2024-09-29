import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useConnectionStore } from '../../../state/connection'
import { useVideoEventStore } from '../../../state/video'
import { showError } from '../../callable/toast/toast'
import { startParty } from '../../../api/party'
import Video from '../../component/video/Video'
import Button from '../../component/button/Button'

export default function Party() {
    const location = useLocation()
    const navigate = useNavigate()
    const publishEvent = useVideoEventStore((state) => state.publish)
    const connection = useConnectionStore((state) => state.connection)

    const [ position, setPosition ] = useState(null)
    const [ partyCode, setPartyCode ] = useState(null)
    const [ adminCode, setAdminCode ] = useState(null)
    const [ autoStart, setAutoStart ] = useState(false)
    const [ numberOfMembers, setNumberOfMembers ] = useState(0)
    const [ started, setStarted ] = useState(false)

    const intervalVideo = useRef(null)
    const videoJsOptions = useRef({
        controls: false,
        responsive: true,
        fluid: true,
        muted: true,
        sources: [{
            src: '/shrek_walk.mp4',
            type: 'video/mp4'
        }]
    })

    const play = (videoDurationInSeconds) => {
        const videoResetTimeMilis = 600
        setTimeout(
            () => {
                publishEvent('play')
                intervalVideo.current = setInterval(
                    () => publishEvent('play'),
                    numberOfMembers * videoDurationInSeconds * videoResetTimeMilis
                )
            },
            position * videoDurationInSeconds * videoResetTimeMilis
        )
    }

    const joyParty = useCallback(() => {
        setStarted(true)
        startParty(partyCode, adminCode)
            .catch(() => setStarted(false))
    }, [adminCode, partyCode])

    const goHome = useCallback(() => {
        clearInterval(intervalVideo.current)
        publishEvent('pause')
        navigate("/")
    }, [])

    useEffect(() => {
        const ws = connection

        if (ws != null) {
            ws.onmessage = event => {
                const payload = JSON.parse(event.data)
                if (payload.error) {
                    showError(payload.error)
                }
                else if (payload.data.members) {
                    setNumberOfMembers(payload.data.members)
                }
                else if (payload.data.start) {
                    play(2)
                }
            }

            ws.onclose = (event) => {
                console.log('Connection closed')
            }

            setPosition(location.state.position)
            setPartyCode(location.state.partyCode)
            setAdminCode(location.state.adminCode)
            setAutoStart(location.state.autoStart)
        }
        else {
            goHome()
        }
    }, [play])

    return (
        <div className="Party h-screen">
            <Video options={videoJsOptions.current}/>
            <div className="absolute top-2 right-2">
                <Button onClick={goHome}>
                    Close
                </Button>
            </div>
            { (adminCode && !autoStart && !started) &&
                <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                    <Button onClick={joyParty}>
                        Start
                    </Button>
                </div>
            }
        </div>
    )
}
