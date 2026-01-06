'use client'

import dynamic from 'next/dynamic'

// Dynamically import games to avoid SSR issues with canvas/window/supabase
const TicTacTurd = dynamic(() => import('@/components/games/TicTacTurd'), { ssr: false })
const Battleflush = dynamic(() => import('@/components/games/Battleflush'), { ssr: false })

export default function GameWrapper({ id, roomId }: { id: string, roomId: string }) {
    if (id === 'tictacturd') return <TicTacTurd roomId={roomId} />
    if (id === 'battleflush') return <Battleflush roomId={roomId} />
    return <div>Game not found</div>
}
