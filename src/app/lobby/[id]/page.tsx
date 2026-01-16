/**
 * Lobby Page
 * Displays after successful pairing - shows available games
 */

'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { GameCard } from '@/components/GameCard';

interface LobbyData {
    id: string;
    userACode: string;
    userBCode: string;
    myRole: 'user_a' | 'user_b';
    partnerCode: string;
}

export default function LobbyPage() {
    const params = useParams();
    const lobbyId = params.id as string;
    const router = useRouter();

    const [lobbyData, setLobbyData] = useState<LobbyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadLobby = async () => {
            const myCode = localStorage.getItem('userCode');

            if (!myCode) {
                setError('No user code found. Please return to home.');
                setLoading(false);
                return;
            }

            // Mock mode: Use localStorage data
            if (!isSupabaseConfigured()) {
                const partnerCode = localStorage.getItem('partnerCode');

                if (!partnerCode) {
                    setError('Lobby data not found. Please pair again.');
                    setLoading(false);
                    return;
                }

                setLobbyData({
                    id: lobbyId,
                    userACode: myCode,
                    userBCode: partnerCode,
                    myRole: 'user_a',
                    partnerCode: partnerCode
                });
                setLoading(false);
                return;
            }

            // Production mode: Fetch from database
            const { data, error: dbError } = await supabase
                .from('user_pairs')
                .select('*')
                .eq('lobby_id', lobbyId)
                .single();

            if (dbError || !data) {
                setError('Lobby not found. It may have expired.');
                setLoading(false);
                return;
            }

            // Determine user's role
            const isUserA = data.user_a_code === myCode;
            const isUserB = data.user_b_code === myCode;

            if (!isUserA && !isUserB) {
                setError('You are not part of this lobby.');
                setLoading(false);
                return;
            }

            setLobbyData({
                id: lobbyId,
                userACode: data.user_a_code,
                userBCode: data.user_b_code,
                myRole: isUserA ? 'user_a' : 'user_b',
                partnerCode: isUserA ? data.user_b_code : data.user_a_code
            });

            setLoading(false);
        };

        loadLobby();
    }, [lobbyId, router]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-deep-brown flex items-center justify-center">
                <div className="text-center">
                    <p className="text-warm-tan font-display text-4xl animate-pulse mb-4">
                        Loading lobby...
                    </p>
                    <p className="text-rust font-irony">
                        🚽 Preparing the games 🚽
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-deep-brown flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-sand border-4 border-black shadow-[8px_8px_0px_#000] p-8 text-center rotate-[-1deg]">
                    <h1 className="text-4xl font-display text-deep-brown mb-4">
                        ⚠️ Oops!
                    </h1>
                    <p className="text-deep-brown font-body text-lg mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-mid-brown text-cream font-display text-xl py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-bronze transition-colors active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                    >
                        🏠 Return Home
                    </button>
                </div>
            </div>
        );
    }

    // Main lobby UI
    return (
        <main className="min-h-screen bg-deep-brown p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-display text-warm-tan mb-4 drop-shadow-[6px_6px_0px_#000] rotate-1">
                        🚽 Game Lobby 🚽
                    </h1>
                    <div className="bg-sand border-4 border-black shadow-[4px_4px_0px_#000] p-4 inline-block rotate-[-0.5deg]">
                        <p className="text-deep-brown font-body text-lg">
                            Paired with: <span className="text-mid-brown font-display text-xl">{lobbyData?.partnerCode}</span>
                        </p>
                    </div>
                </div>

                {/* Game List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <GameCard
                        id="tictacturd"
                        title="Tic Tac Turd"
                        description="Classic game with a twist"
                        emoji="💩"
                        lobbyId={lobbyId}
                    />
                    <GameCard
                        id="battleflush"
                        title="Battleflush"
                        description="Hide your logs"
                        emoji="🪵"
                        lobbyId={lobbyId}
                    />
                </div>

                {/* Footer Actions */}
                <div className="text-center">
                    <button
                        onClick={() => {
                            // Clear pairing data
                            localStorage.removeItem('currentLobby');
                            localStorage.removeItem('partnerCode');
                            router.push('/');
                        }}
                        className="text-rust font-irony underline hover:no-underline text-lg"
                    >
                        ← Leave Lobby
                    </button>
                </div>
            </div>
        </main>
    );
}
