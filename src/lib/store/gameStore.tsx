"use client";

import { createInitialState } from "@/lib/core/gameState";
import type { GameConfig, GameState, Mode, PlayerId } from "@/lib/core/types";
import { reduce, type Action } from "@/lib/core/engine";
import { createContext, useContext, useMemo, useState } from "react";

type WallPreview = { h: boolean; r: number; c: number; legal: boolean; player: PlayerId } | null;

type GameCtx = {
    cfg: GameConfig;
    state: GameState;
    dispatch(a: Action): void;
    setCfg(m: Partial<GameConfig>): void;
    wallPreview: WallPreview;
    setWallPreview: (p: WallPreview) => void;
};

const GameContext = createContext<GameCtx | null>(null);

export function GameProvider({ mode, children }: { mode: Mode; children: React.ReactNode }) {
    const [cfg, setCfgState] = useState<GameConfig>(() => ({
        size: 9,
        wallsPerPlayer: 10,
        mode,
    }));
    const [state, setState] = useState<GameState>(() => createInitialState(cfg));
    const [wallPreview, setWallPreview] = useState<WallPreview>(null);

    const api = useMemo<GameCtx>(() => {
        return {
            cfg,
            state,
            wallPreview,
            setWallPreview,
            dispatch(a) {
                setState((prev) => reduce(prev, a));
                setWallPreview(null); // limpiar preview tras acción
            },
            setCfg(m) {
                setCfgState((prev) => ({ ...prev, ...m }));
            },
        };
    }, [cfg, state, wallPreview]);

    return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGame must be used within GameProvider");
    return ctx;
}

// helpers de UI
export function playerColor(p: PlayerId) {
    return p === 0 ? "bg-[var(--accent-red)]" : "bg-[var(--accent-blue)]";
}
export function playerText(p: PlayerId) {
    return p === 0 ? "text-[var(--accent-red)]" : "text-[var(--accent-blue)]";
}
