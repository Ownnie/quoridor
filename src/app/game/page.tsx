// Página server component: obtenemos searchParams vía props para evitar CSR y el Suspense warning.
import { FadeIn } from "@/components/ui/FadeIn";
import { GameProvider } from "@/lib/store/gameStore";
import { Board } from "@/components/game/Board";
import { Hud } from "@/components/game/Hud";
import { RestartButton } from "../../components/game/RestartButton";
import type { Mode } from "@/lib/core/types";
import Link from "next/link";

export default function GamePage({ searchParams }: { searchParams: { mode?: string } }) {
    const mode = (searchParams.mode as Mode) || "cpu";

    return (
        <GameProvider mode={mode}>
            <FadeIn ms={350}>
                <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-6 px-6 py-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Juego — {mode === "cpu" ? "Persona vs Máquina" : "Persona vs Persona"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <RestartButton />
                            <Link
                                href="/"
                                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800/80"
                            >
                                &larr; Menú
                            </Link>
                        </div>
                    </div>

                    <Hud />

                    <section className="flex justify-center">
                        <Board size={9} />
                    </section>

                    <p className="text-center text-xs text-neutral-500">Turnos automáticos para Azul en modo CPU (heurística codiciosa).</p>
                </main>
            </FadeIn>
        </GameProvider>
    );
}

// RestartButton movido a componente cliente dedicado para evitar uso de hook en server.
