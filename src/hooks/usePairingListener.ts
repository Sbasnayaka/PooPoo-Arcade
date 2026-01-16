/**
 * Pairing Listener Hook
 * Listens for realtime pairing notifications and handles automatic redirect
 */

'use client'

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Listens for pairing events for the current user
 * Automatically redirects to lobby when paired by another user
 * 
 * @param userCode - The current user's unique code
 */
export function usePairingListener(userCode: string) {
    const router = useRouter();
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        if (!userCode) return;

        // Mock mode: Poll localStorage for mock pairing events
        if (!isSupabaseConfigured()) {
            const mockListener = setupMockListener(userCode, router);
            return () => clearInterval(mockListener);
        }

        // Real mode: Subscribe to Supabase realtime channel
        const channel = supabase.channel(`pairing:${userCode}`);
        channelRef.current = channel;

        channel
            .on('broadcast', { event: 'paired' }, (payload) => {
                const { lobbyId, partnerCode } = payload.payload;
                console.log('🔔 Paired with:', partnerCode);

                // Store lobby info in localStorage
                localStorage.setItem('currentLobby', lobbyId);
                localStorage.setItem('partnerCode', partnerCode);

                // Redirect to lobby
                router.push(`/lobby/${lobbyId}`);
            })
            .subscribe((status) => {
                console.log('Pairing channel status:', status);
            });

        return () => {
            channel.unsubscribe();
            channelRef.current = null;
        };
    }, [userCode, router]);
}

/**
 * Mock listener for development without Supabase
 * Polls localStorage for pairing events
 */
function setupMockListener(userCode: string, router: any): NodeJS.Timeout {
    return setInterval(() => {
        const mockPairingData = localStorage.getItem('mockPairing');

        if (mockPairingData) {
            try {
                const pairing = JSON.parse(mockPairingData);

                // Check if this user is the partner being paired with
                if (pairing.partnerCode === userCode) {
                    console.log('🔔 Mock pairing detected:', pairing);

                    // Store lobby info
                    localStorage.setItem('currentLobby', pairing.lobbyId);
                    localStorage.setItem('partnerCode', pairing.myCode);

                    // Clear the mock pairing event
                    localStorage.removeItem('mockPairing');

                    // Redirect to lobby
                    router.push(`/lobby/${pairing.lobbyId}`);
                }
            } catch (error) {
                console.error('Error parsing mock pairing:', error);
                localStorage.removeItem('mockPairing');
            }
        }
    }, 1000); // Poll every second
}

/**
 * Hook to check if user is already in a lobby
 * Useful for handling page refreshes
 * 
 * @returns Current lobby ID if user is in a lobby, null otherwise
 */
export function useCurrentLobby(): string | null {
    useEffect(() => {
        return () => {
            // Cleanup could go here
        };
    }, []);

    if (typeof window === 'undefined') return null;

    return localStorage.getItem('currentLobby');
}
