import GameWrapper from '@/components/GameWrapper';

export const dynamicParams = true;

export async function generateStaticParams() {
    return [
        { id: 'tictacturd' },
        { id: 'battleflush' },
    ]
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Simple random room for demo
    const roomId = `room-${id}-demo`;

    return (
        <main className="min-h-screen bg-deep-brown flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl text-warm-tan font-display mb-8 drop-shadow-[4px_4px_0px_#000] rotate-1">
                {id.toUpperCase()} AREA
            </h1>

            <div className="bg-pattern-dots bg-repeat opacity-20 absolute inset-0 pointer-events-none"></div>

            <GameWrapper id={id} roomId={roomId} />

            <a href="/" className="mt-12 text-rust font-irony underline hover:no-underline z-10">
                &larr; Back to the Pile
            </a>
        </main>
    )
}
