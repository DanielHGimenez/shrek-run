import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useVideoEventStore } from '../../../state/video'

export default function Video({ options, onReady }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const event = useVideoEventStore((state) => state.event)

    useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
            const videoElement = document.createElement("video-js");

            videoElement.classList.add('vjs-4-3');
            videoRef.current.appendChild(videoElement);

            const player = videojs(videoElement, options, () => {
                videojs.log('player is ready');
                onReady && onReady(player);
            });

            playerRef.current = player;

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(options.autoplay);
            player.src(options.sources);
        }
    }, [onReady, options, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    useEffect(() => {
        if (event) {
            let player = playerRef.current
            switch (event.name) {
                case 'play':
                    player.play();
                break
                case 'pause':
                    player.pause();
                break
                case 'fullscreen':
                    if (player.supportsFullScreen()) {
                        if (!player.isFullscreen()) {
                            player.requestFullscreen()
                        }
                    }
                    else {
                        if (!player.isFullWindow) {
                            player.enterFullWindow()
                        }
                    }
                break
            }
        }
    }, [event])

    return (
        <div data-vjs-player>
            <div ref={videoRef}/>
        </div>
    );
};
