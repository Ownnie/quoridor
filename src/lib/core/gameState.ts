import type { GameConfig, GameState, Pos } from "./types";

function makeMatrix<T>(rows: number, cols: number, val: T): T[][] {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => val));
}

export function createInitialState(cfg: GameConfig): GameState {
    const n = cfg.size;
    const mid = Math.floor(n / 2);

    const p0: Pos = { r: n - 1, c: mid }; // Rojo abajo
    const p1: Pos = { r: 0, c: mid };     // Azul arriba

    return {
        size: n,
        turn: 0,
        pawn: [p0, p1],
        wallsLeft: [cfg.wallsPerPlayer, cfg.wallsPerPlayer],
        H: makeMatrix(n - 1, n, false), // 8x9
        V: makeMatrix(n, n - 1, false), // 9x8
        HO: makeMatrix(n - 1, n, null),
        VO: makeMatrix(n, n - 1, null),
        winner: null,
    };
}
