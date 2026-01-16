/**
 * Game Card Component
 * Displays individual game in the lobby with play button
 */

'use client'

import { useRouter } from 'next/navigation';

interface GameCardProps {
    id: string;
    title: string;
    description: string;
    emoji: string;
    lobbyId: string;
}

export function GameCard({ id, title, description, emoji, lobbyId }: GameCardProps) {
    const router = useRouter();

    const handlePlay = () => {
        // Generate game room ID from lobby
        const roomId = `${lobbyId}-${id}`;
        router.push(`/games/${id}?room=${roomId}`);
    };

    return (
        <div className="bg-sand border-4 border-black shadow-[8px_8px_0px_#000] p-6 hover:scale-105 transition-transform rotate-[-0.5deg]">
            {/* Game Emoji/Icon */}
            <div className="text-6xl text-center mb-4">
                {emoji}
            </div>

            {/* Game Info */}
            <h3 className="text-2xl font-display text-deep-brown mb-2 text-center">
                {title}
            </h3>
            <p className="text-deep-brown font-body mb-4 text-center text-sm">
                {description}
            </p>

            {/* Play Button */}
            <button
                onClick={handlePlay}
                className="w-full bg-mid-brown text-cream font-display text-xl py-3 border-4 border-black shadow-[4px_4px_0px_#000] hover:bg-bronze transition-colors active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
                PLAY
            </button>
        </div>
    );
}
