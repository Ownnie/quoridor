"use client";

import { useGame, playerText } from "@/lib/store/gameStore";

export function Hud() {
    const { state, thinking } = useGame();
    return (
        <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3">
            <div className="text-sm text-neutral-400">
                Turno:{" "}
                <span className={`font-medium ${playerText(state.turn)}`}>
                    {state.turn === 0 ? "Rojo (Humano)" : "Azul (Humano/CPU)"}
                </span>
                {thinking && (
                    <span className="ml-3 rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-200">Pensando…</span>
                )}
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-400">
                <div>
                    Muros — <span className="text-red-400">Rojo</span>: {state.wallsLeft[0]}
                </div>
                <div>
                    Muros — <span className="text-blue-400">Azul</span>: {state.wallsLeft[1]}
                </div>
                {state.winner !== null && (
                    <div className="rounded-lg bg-neutral-800 px-3 py-1 font-medium text-neutral-100">
                        Ganó {state.winner === 0 ? "Rojo" : "Azul"}
                    </div>
                )}
            </div>
        </div>
    );
}
