import Container from "@/components/Container";
import GamePile from "@/components/GamePile";
import SquelchButton from "@/components/SquelchButton";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-septic overflow-hidden flex flex-col">
      {/* Header Layer - Above Physics */}
      <div className="z-20 relative pt-12 text-center pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-display text-bile drop-shadow-[6px_6px_0px_#000] rotate-2 inline-block">
          PooPoo Arcade
        </h1>
        <p className="text-xl font-body text-fawn mt-4 bg-sewage inline-block px-4 py-1 rotate-[-1deg] border-2 border-black shadow-[4px_4px_0px_#000]">
          #1 Source for Brown Gaming
        </p>
      </div>

      {/* Physics Layer - Takes up remaining space */}
      <div className="flex-1 relative w-full h-full min-h-[500px]">
        <GamePile />
      </div>

      {/* UI Overlay Layer */}
      <div className="z-20 p-8 flex justify-center gap-4 pointer-events-none">
        <SquelchButton className="pointer-events-auto">
          LOGIN (Occupied)
        </SquelchButton>
      </div>

      <div className="absolute bottom-4 left-4 text-burnt-sienna font-irony animate-bounce z-10 pointer-events-none">
        WARNING: Physics may be sticky.
      </div>
    </main>
  );
}
