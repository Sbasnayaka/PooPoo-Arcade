import TicTacTurd from '@/components/games/TicTacTurd';
import Battleflush from '@/components/games/Battleflush';

export async function generateStaticParams() {
    return [
        { id: 'tictacturd' },
        { id: 'battleflush' },
    ]
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Simple random room for demo, or read from searchParams if we were using client component with useSearchParams
    // For this static/server hybrid, we'll just pass a static demo room + id
    const roomId = `room-${id}-demo`;

    return (
        <main className="min-h-screen bg-septic flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl text-bile font-display mb-8 drop-shadow-[4px_4px_0px_#000] rotate-1">
                {id.toUpperCase()} AREA
            </h1>

            <div className="bg-pattern-dots bg-repeat opacity-20 absolute inset-0 pointer-events-none"></div>

            {id === 'tictacturd' && <TicTacTurd roomId={roomId} />}
            {id === 'battleflush' && <Battleflush roomId={roomId} />}

            <a href="/" className="mt-12 text-burnt-sienna font-irony underline hover:no-underline">
                &larr; Back to the Pile
            </a>
        </main>
    )
}
