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

/* ---------- Movimiento completo (saltos y diagonales) ---------- */

function eq(a: Pos, b: Pos) { return a.r === b.r && a.c === b.c; }
function occupied(s: GameState, p: Pos) { return eq(s.pawn[0], p) || eq(s.pawn[1], p); }

/**
 * Genera todos los movimientos legales para un jugador según Quoridor:
 * - Paso ortogonal si no hay muro y la celda no está ocupada.
 * - Si el vecino ortogonal está ocupado por el rival:
 *   - Salto por detrás si no hay muro entre rival y la celda detrás (y está en tablero).
 *   - En caso contrario, diagonales alrededor del rival si no hay muro entre rival y esas diagonales.
 */
export function legalMoves(s: GameState, player: PlayerId): Pos[] {
    const out: Pos[] = [];
    const from = s.pawn[player];
    const other = s.pawn[player === 0 ? 1 : 0];

    const DIRS: Pos[] = [
        { r: -1, c: 0 }, // up
        { r: 1, c: 0 },  // down
        { r: 0, c: -1 }, // left
        { r: 0, c: 1 },  // right
    ];

    for (const d of DIRS) {
        const n: Pos = { r: from.r + d.r, c: from.c + d.c };
        if (!inBounds(s, n) || blocked(s, from, n)) continue;

        if (eq(n, other)) {
            // Intento de salto por detrás en la misma dirección
            const behind: Pos = { r: n.r + d.r, c: n.c + d.c };
            if (inBounds(s, behind) && !blocked(s, n, behind) && !occupied(s, behind)) {
                out.push(behind);
                continue; // si se puede saltar, no hay diagonales en esta dirección
            }

            // Diagonales alrededor del rival (si no se puede saltar)
            const diags: Pos[] = d.r !== 0
                ? [{ r: n.r, c: n.c - 1 }, { r: n.r, c: n.c + 1 }] // venimos vertical -> diagonales izquierda/derecha
                : [{ r: n.r - 1, c: n.c }, { r: n.r + 1, c: n.c }];  // venimos horizontal -> diagonales arriba/abajo

            for (const dg of diags) {
                if (!inBounds(s, dg)) continue;
                if (!blocked(s, n, dg) && !occupied(s, dg)) out.push(dg);
            }
        } else {
            // Paso simple
            if (!occupied(s, n)) out.push(n);
        }
    }
    return out;
}

export function canMove(s: GameState, player: PlayerId, to: Pos) {
    if (!inBounds(s, to)) return false;
    return legalMoves(s, player).some((p) => p.r === to.r && p.c === to.c);
}

export function applyMove(s: GameState, player: PlayerId, to: Pos): GameState {
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
