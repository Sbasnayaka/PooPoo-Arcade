'use client'

import { useEffect, useState } from 'react'

export default function BoredomDetector() {
    const [inactive, setInactive] = useState(false)
    const [pos, setPos] = useState({ x: 100, y: 100 })
    const [vel, setVel] = useState({ x: 2, y: 2 })

    useEffect(() => {
        let timeout: NodeJS.Timeout
        const resetTimer = () => {
            setInactive(false)
            clearTimeout(timeout)
            timeout = setTimeout(() => setInactive(true), 10000) // 10s
        }

        window.addEventListener('mousemove', resetTimer)
        window.addEventListener('keydown', resetTimer)
        window.addEventListener('click', resetTimer)

        resetTimer()

        return () => {
            clearTimeout(timeout)
            window.removeEventListener('mousemove', resetTimer)
            window.removeEventListener('keydown', resetTimer)
            window.removeEventListener('click', resetTimer)
        }
    }, [])

    useEffect(() => {
        if (!inactive) return

        const loop = setInterval(() => {
            setPos(p => {
                let nx = p.x + vel.x
                let ny = p.y + vel.y
                let nvx = vel.x
                let nvy = vel.y

                if (nx <= 0 || nx >= window.innerWidth - 64) nvx = -nvx
                if (ny <= 0 || ny >= window.innerHeight - 64) nvy = -nvy

                if (nvx !== vel.x || nvy !== vel.y) setVel({ x: nvx, y: nvy })

                return { x: nx, y: ny }
            })
        }, 16)

        return () => clearInterval(loop)
    }, [inactive, vel])

    if (!inactive) return null

    return (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-80 pointer-events-none">
            <div
                className="absolute text-6xl"
                style={{ left: pos.x, top: pos.y }}
            >
                💩
            </div>
        </div>
    )
}
