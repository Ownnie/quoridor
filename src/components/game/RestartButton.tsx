"use client";

import { useGame } from "@/lib/store/gameStore";

export function RestartButton() {
    const { reset, state, thinking } = useGame();
    return (
        <button
            onClick={() => reset()}
            disabled={thinking}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            Reiniciar
        </button>
    );
}
