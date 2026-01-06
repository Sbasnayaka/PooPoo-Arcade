'use client'

import { useState, useEffect } from 'react'
import { useMultiplayer } from '@/hooks/useMultiplayer'
import SquelchButton from '@/components/SquelchButton'

export default function TicTacTurd({ roomId }: { roomId: string }) {
    // Game State: 3x3 grid, null = empty, 'P1' = Turd, 'P2' = Paper
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [isMyTurn, setIsMyTurn] = useState(true) // Naive generic turn for simplify 
    const { isConnected, lastPayload, sendMove } = useMultiplayer(roomId)

    // Sync state from broadcast
    useEffect(() => {
        if (lastPayload) {
            setBoard(lastPayload.board)
            setIsMyTurn(true) // If we received a payload, it means opponent moved, so it's our turn
        }
    }, [lastPayload])

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    const handleClick = (i: number) => {
        if (board[i] || checkWinner(board)) return;

        // Naive local play simulation for demo if not connected or testing solo
        // In real multiplayer, we'd check player roles
        const nextBoard = board.slice();
        nextBoard[i] = '💩'; // We are always Turd locally for this demo step

        setBoard(nextBoard);
        sendMove({ board: nextBoard })
        setIsMyTurn(false)
    }

    const winner = checkWinner(board)
    const status = winner ? `Winner: ${winner}` : `Next player: ${isMyTurn ? 'You (💩)' : 'Them (🧻)'}`

    return (
        <div className="flex flex-col items-center gap-6 bg-cardboard p-8 border-4 border-black shadow-[8px_8px_0px_#000] rotate-1">
            <h2 className="text-3xl font-display text-septic">{isConnected ? 'LIVE' : 'Connecting...'} Status: {status}</h2>

            <div className="grid grid-cols-3 gap-0 border-4 border-black bg-septic">
                {board.map((square, i) => (
                    <button
                        key={i}
                        className="w-24 h-24 border-2 border-black flex items-center justify-center text-5xl bg-fawn hover:bg-cardboard focus:outline-none"
                        onClick={() => handleClick(i)}
                    >
                        {square}
                    </button>
                ))}
            </div>

            <SquelchButton onClick={() => { setBoard(Array(9).fill(null)); sendMove({ board: Array(9).fill(null) }) }}>
                FLUSH (Reset)
            </SquelchButton>
        </div>
    )
}
