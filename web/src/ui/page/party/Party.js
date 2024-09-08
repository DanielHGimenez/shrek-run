import React, { useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useConnectionStore } from '../../../state/connection'
import { useVideoEventStore } from '../../../state/video'
import { showError } from '../../callable/toast/toast'
import Video from '../../component/video/Video'
import Button from '../../component/button/Button'
import Modal from '../../component/modal/Modal'

export default function Party() {
    const location = useLocation()
    const navigate = useNavigate()
    const publishEvent = useVideoEventStore((state) => state.publish)
    const connection = useConnectionStore((state) => state.connection)

    const position = useRef(null)
    const adminCode = useRef(null)
    const numberOfMembers = useRef(0)

    const intervalVideo = useRef(null)
    const videoJsOptions = useRef({
        controls: false,
        responsive: true,
        fluid: true,
        height: 390,
        width: 640,
        sources: [{
            src: '/shrek_walk.mp4',
            type: 'video/mp4'
        }]
    })

    const play = useCallback((videoDurationInSeconds) => {
        setTimeout(
            () => {
                publishEvent('play')
                intervalVideo.current = setInterval(
                    () => publishEvent('play'),
                    numberOfMembers.current * videoDurationInSeconds * 1000
                )
            },
            position.current * videoDurationInSeconds * 1000
        )
    }, [])

    const goHome = useCallback(() => {
        clearInterval(intervalVideo.current)
        navigate("/")
    }, [])

    useEffect(() => {
        const ws = connection

        ws.onmessage = event => {
            const payload = JSON.parse(event.data)
            if (payload.error) {
                showError(payload.error)
            }
            else if (payload.data.members) {
                numberOfMembers.current = payload.data.members
            }
            else if (payload.data.start) {
                play(2)
            }
        }

        ws.onclose = (event) => {
            console.log('Connection closed')
        }

        position.current = location.state.position
        adminCode.current = location.state.adminCode
    }, [])

    return (
        <div className="Party">
            <Video options={videoJsOptions.current}/>
            <div className="absolute top-2 right-2">
                <Button onClick={goHome}>
                    Close
                </Button>
            </div>
            <Modal>
                <Button onClick={goHome}>
                    Close
                </Button>
            </Modal>
        </div>
    )
}
