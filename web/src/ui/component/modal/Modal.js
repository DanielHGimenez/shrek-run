import React, { useEffect } from 'react'

export default function Modal({ children, onClose }) {

    useEffect(() => {

    }, [])

    return (
        <div className="iziModal">
            {children}
        </div>
    )
}
