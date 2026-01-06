import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface MultiplayerState {
    isConnected: boolean
    payload: any
}

export function useMultiplayer(roomId: string, username: string = 'Anonymous') {
    const [status, setStatus] = useState<MultiplayerState>({ isConnected: false, payload: null })
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!roomId) return

        const room = supabase.channel(`game:${roomId}`, {
            config: {
                presence: {
                    key: username,
                },
            },
        })

        room
            .on('broadcast', { event: 'game-state' }, ({ payload }) => {
                setStatus(prev => ({ ...prev, payload }))
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setStatus(prev => ({ ...prev, isConnected: true }))
                }
            })

        setChannel(room)

        return () => {
            supabase.removeChannel(room)
        }
    }, [roomId, username])

    const sendMove = (movePayload: any) => {
        channel?.send({
            type: 'broadcast',
            event: 'game-state',
            payload: movePayload,
        })
    }

    return { isConnected: status.isConnected, lastPayload: status.payload, sendMove }
}
