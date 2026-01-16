'use client'

import { useEffect, useRef, useState } from 'react'

export default function StinkCursor() {
    const [pos, setPos] = useState({ x: -100, y: -100 })
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [])

    // Simple particle trail could be done with a small array of past positions
    // or a canvas. For simplicity/performance: just the main cursor for now, 
    // maybe a CSS animation trail if requested.
    // "Green stink lines" -> We'll add a few static elements trailing or just wobbling around current pos.

    return (
        <div
            ref={cursorRef}
            className="fixed pointer-events-none z-[9999] mix-blend-exclusion"
            style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className="text-2xl animate-pulse">🪰</div>
            <div className="absolute top-0 left-0 w-full h-full animate-ping text-warm-tan opacity-50 text-xs">
                sss
            </div>
        </div>
    )
}
