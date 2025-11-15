"use client";

import { useMemo } from "react";
import { useGame } from "@/lib/store/gameStore";
import { canPlaceWall } from "@/lib/core/rules";

/** Grosor visual de la pista (debe coincidir con Board) */
export const TRACK_PX = 8;

/** Slot horizontal (usa anchorC como ancla real del muro) */
export function WallSlotH({ r, anchorC }: { r: number; anchorC: number }) {
    const { state, dispatch, setWallPreview, inputDisabled } = useGame();
    const legal = useMemo(() => canPlaceWall(state, state.turn, true, r, anchorC), [state, r, anchorC]);

    function onEnter() { if (inputDisabled) return; setWallPreview({ h: true, r, c: anchorC, legal, player: state.turn }); }
    function onLeave() { setWallPreview(null); }
    function onClick() { if (!legal || inputDisabled) return; dispatch({ kind: "placeWall", player: state.turn, h: true, r, c: anchorC }); }

    return (
        <button
            onMouseEnter={onEnter}
            onMouseMove={onEnter}
            onMouseLeave={onLeave}
            onClick={onClick}
            // 🔧 z-0 para que quede DEBAJO del overlay
            className="absolute inset-0 z-0 block h-full w-full rounded-[4px]
                 bg-neutral-700 hover:bg-neutral-600
                 appearance-none p-0 border-0"
            aria-label={`wh-${r}-${anchorC}`}
            title={legal ? "Colocar muro horizontal" : "No permitido"}
            disabled={inputDisabled}
        />
    );
}

/** Slot vertical (usa anchorR como ancla real del muro) */
export function WallSlotV({ c, anchorR }: { c: number; anchorR: number }) {
    const { state, dispatch, setWallPreview, inputDisabled } = useGame();
    const legal = useMemo(() => canPlaceWall(state, state.turn, false, anchorR, c), [state, anchorR, c]);

    function onEnter() { if (inputDisabled) return; setWallPreview({ h: false, r: anchorR, c, legal, player: state.turn }); }
    function onLeave() { setWallPreview(null); }
    function onClick() { if (!legal || inputDisabled) return; dispatch({ kind: "placeWall", player: state.turn, h: false, r: anchorR, c }); }

    return (
        <button
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            onClick={onClick}
            style={{ width: TRACK_PX }}
            className="h-full w-full rounded-[4px] bg-neutral-700 transition hover:bg-neutral-600"
            aria-label={`wv-${anchorR}-${c}`}
            title={legal ? "Colocar muro vertical" : "No permitido"}
            disabled={inputDisabled}
        />
    );
}
