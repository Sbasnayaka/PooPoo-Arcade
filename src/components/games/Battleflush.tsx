'use client'

import { useState } from 'react'
import { useMultiplayer } from '@/hooks/useMultiplayer'

export default function Battleflush({ roomId }: { roomId: string }) {
    // Simple 5x5 grid
    // 0 = water, 1 = ship (hidden), 2 = hit, 3 = miss
    const [myBoard, setMyBoard] = useState(Array(25).fill(0))
    const { isConnected, sendMove } = useMultiplayer(roomId)

    // Demo: Click to place "ship" (log) or toggle state
    const handleClick = (i: number) => {
        const newBoard = [...myBoard]
        newBoard[i] = newBoard[i] === 0 ? 1 : 0
        setMyBoard(newBoard)
        sendMove({ action: 'fire', index: i })
    }

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-deep-brown border-4 border-sand text-cream">
            <h2 className="text-2xl font-display">Battleflush (WIP)</h2>
            <p className="font-irony text-sm">Click to hide your logs.</p>

            <div className="grid grid-cols-5 gap-1">
                {myBoard.map((cell, i) => (
                    <div
                        key={i}
                        onClick={() => handleClick(i)}
                        className={`w-12 h-12 border border-sand flex items-center justify-center cursor-pointer ${cell === 1 ? 'bg-mid-brown' : 'bg-blue-900'}`}
                    >
                        {cell === 1 ? '🪵' : ''}
                    </div>
                ))}
            </div>
            <div className="text-xs text-warm-tan">{isConnected ? 'Connected to Sewer' : 'Offline'}</div>
        </div>
    )
}
