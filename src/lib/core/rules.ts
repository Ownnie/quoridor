import type { GameState, PlayerId, Pos } from "./types";
import { pathExists } from "./bfs";

/** Dentro del tablero */
export function inBounds(s: GameState, p: Pos) {
    return p.r >= 0 && p.r < s.size && p.c >= 0 && p.c < s.size;
}

/** Meta */
export function isGoal(s: GameState, player: PlayerId, p: Pos) {
    return player === 0 ? p.r === 0 : p.r === s.size - 1;
}

/** ¿Hay muro entre a y b? (un paso ortogonal) */
export function blocked(s: GameState, a: Pos, b: Pos): boolean {
    if (a.r === b.r && Math.abs(a.c - b.c) === 1) {
        const cmin = Math.min(a.c, b.c);
        return s.V[a.r][cmin];
    }
    if (a.c === b.c && Math.abs(a.r - b.r) === 1) {
        const rmin = Math.min(a.r, b.r);
        return s.H[rmin][a.c];
    }
    return true;
}

/** Vecinos ortogonales sin cruzar muros (1 paso) */
export function neighbors(s: GameState, p: Pos): Pos[] {
    const cand: Pos[] = [
        { r: p.r - 1, c: p.c },
        { r: p.r + 1, c: p.c },
        { r: p.r, c: p.c - 1 },
        { r: p.r, c: p.c + 1 },
    ];
    const out: Pos[] = [];
    for (const q of cand) {
        if (!inBounds(s, q)) continue;
        if (!blocked(s, p, q)) out.push(q);
    }
    return out;
}

/* ---------- Movimiento simple ---------- */

export function canMoveSimple(s: GameState, player: PlayerId, to: Pos) {
    const from = s.pawn[player];
    if (!inBounds(s, to)) return false;
    const dr = Math.abs(from.r - to.r);
    const dc = Math.abs(from.c - to.c);
    if (dr + dc !== 1) return false;
    if (blocked(s, from, to)) return false;
    const other = s.pawn[player === 0 ? 1 : 0];
    if (other.r === to.r && other.c === to.c) return false;
    return true;
}

export function applyMoveSimple(s: GameState, player: PlayerId, to: Pos): GameState {
    const next: GameState = structuredClone(s);
    next.pawn[player] = { ...to };
    if (isGoal(next, player, to)) next.winner = player;
    next.turn = (s.turn === 0 ? 1 : 0) as PlayerId;
    return next;
}

/* ---------- Muros (2 segmentos) ---------- */

export function canPlaceWall(s: GameState, player: PlayerId, h: boolean, r: number, c: number): boolean {
    if (s.winner !== null) return false;
    if (s.wallsLeft[player] <= 0) return false;
    const n = s.size;

    if (h) {
        // H[r][c] y H[r][c+1]  => r ∈ [0..n-2], c ∈ [0..n-2]
        if (r < 0 || r > n - 2 || c < 0 || c > n - 2) return false;   // ← FIX (antes invalidábamos c==n-2)
        if (s.H[r][c] || s.H[r][c + 1]) return false;                 // solape
        if (s.V[r][c] && s.V[r + 1][c]) return false;                 // cruce con vertical doble
        const sim = structuredClone(s);
        sim.H[r][c] = true; sim.H[r][c + 1] = true;
        return pathExists(sim, 0) && pathExists(sim, 1);
    } else {
        // V[r][c] y V[r+1][c]  => r ∈ [0..n-2], c ∈ [0..n-2]
        if (r < 0 || r > n - 2 || c < 0 || c > n - 2) return false;   // ← FIX (antes invalidábamos r==n-2)
        if (s.V[r][c] || s.V[r + 1][c]) return false;                 // solape
        if (s.H[r][c] && s.H[r][c + 1]) return false;                 // cruce con horizontal doble
        const sim = structuredClone(s);
        sim.V[r][c] = true; sim.V[r + 1][c] = true;
        return pathExists(sim, 0) && pathExists(sim, 1);
    }
}


export function applyPlaceWall(s: GameState, player: PlayerId, h: boolean, r: number, c: number): GameState {
    const next: GameState = structuredClone(s);
    if (h) {
        next.H[r][c] = true; next.H[r][c + 1] = true;
        next.HO[r][c] = player; next.HO[r][c + 1] = player;   // ← coloreamos ambos
    } else {
        next.V[r][c] = true; next.V[r + 1][c] = true;
        next.VO[r][c] = player; next.VO[r + 1][c] = player;   // ← coloreamos ambos
    }
    next.wallsLeft[player] -= 1;
    next.turn = (s.turn === 0 ? 1 : 0) as PlayerId;
    return next;
}
