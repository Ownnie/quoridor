"use client";

import { createInitialState } from "@/lib/core/gameState";
import type { GameConfig, GameState, Mode, PlayerId } from "@/lib/core/types";
import { reduce, type Action } from "@/lib/core/engine";
import { chooseGreedyAction } from "@/lib/core/ai";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WallPreview = { h: boolean; r: number; c: number; legal: boolean; player: PlayerId } | null;

type GameCtx = {
    cfg: GameConfig;
    state: GameState;
    thinking: boolean;
    inputDisabled: boolean;
    dispatch(a: Action): void;
    setCfg(m: Partial<GameConfig>): void;
    wallPreview: WallPreview;
    setWallPreview: (p: WallPreview) => void;
    reset(): void;
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
    const [thinking, setThinking] = useState(false);

    // CPU (jugador 1) cuando el modo es "cpu"
    useEffect(() => {
        if (cfg.mode !== "cpu") return;
        if (state.winner !== null) return;
        if (state.turn !== 1) return;
        if (thinking) return;

        let canceled = false;
        setThinking(true);
        const t = setTimeout(() => {
            if (canceled) return;
            const a = chooseGreedyAction(state, 1);
            if (a) {
                setState((prev) => reduce(prev, a));
            }
            setThinking(false);
        }, 300);
        return () => { canceled = true; clearTimeout(t); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cfg.mode, state.turn, state.winner, state]);

    const api = useMemo<GameCtx>(() => {
        const inputDisabled = thinking || state.winner !== null || (cfg.mode === "cpu" && state.turn === 1);
        return {
            cfg,
            state,
            thinking,
            inputDisabled,
            wallPreview,
            setWallPreview,
            dispatch(a) {
                setState((prev) => reduce(prev, a));
                setWallPreview(null); // limpiar preview tras acción
            },
            setCfg(m) {
                setCfgState((prev) => ({ ...prev, ...m }));
            },
            reset() {
                setState(createInitialState(cfg));
                setWallPreview(null);
                setThinking(false);
            },
        };
    }, [cfg, state, wallPreview, thinking]);

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
