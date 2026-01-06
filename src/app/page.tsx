import Container from "@/components/Container";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-12 bg-septic overflow-hidden relative">
      <h1 className="text-6xl md:text-9xl font-display text-bile drop-shadow-[6px_6px_0px_#000] text-center animate-pulse rotate-2">
        PooPoo Arcade
      </h1>

      <Container className="max-w-md w-full text-center">
        <p className="text-xl font-body mb-6">
          Welcome to the #1 source for Fecal Neo-Brutalism gaming.
        </p>
        <button className="bg-sewage text-fawn px-8 py-4 font-display text-3xl border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-bile active:text-septic cursor-pointer">
          ENTER THE SEPTIC TANK
        </button>
      </Container>

      <div className="absolute bottom-10 text-burnt-sienna font-irony animate-bounce text-lg">
        WARNING: May contain traces of corn.
      </div>
    </main>
  );
}
