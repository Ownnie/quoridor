"use client";

import type { Pos } from "@/lib/core/types";
import { useGame, playerColor } from "@/lib/store/gameStore";
import { canMoveSimple } from "@/lib/core/rules";

/**
 * - Botón ocupa toda la celda (cuadrada gracias a `aspect-square` del grid padre).
 * - Peón perfectamente centrado.
 * - Destinos legales: overlay con fondo suave + ring visible.
 */
export function Cell({ r, c }: Pos) {
    const { state, dispatch } = useGame();

    const isP0 = state.pawn[0].r === r && state.pawn[0].c === c;
    const isP1 = state.pawn[1].r === r && state.pawn[1].c === c;

    const legalTarget = canMoveSimple(state, state.turn, { r, c });

    function onClick() {
        if (!legalTarget) return;
        dispatch({ kind: "move", player: state.turn, to: { r, c } });
    }

    return (
        <button
            onClick={onClick}
            className={`relative flex h-full w-full items-center justify-center rounded-lg
        transition ${legalTarget ? "hover:brightness-110" : "hover:brightness-105"}`}
            aria-label={`cell-${r}-${c}`}
        >
            {/* Overlay de destino legal (fondo + ring) */}
            {legalTarget && (
                <span className="pointer-events-none absolute inset-1 rounded-md ring-2 ring-neutral-400/70 bg-white/5" />
            )}

            {/* Peones centrados */}
            {isP0 && <span className={`relative z-10 block size-4 rounded-full ${playerColor(0)}`} />}
            {isP1 && <span className={`relative z-10 block size-4 rounded-full ${playerColor(1)}`} />}
        </button>
    );
}
