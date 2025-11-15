import type { GameState, PlayerId, Pos } from "./types";
import { neighbors, isGoal } from "./rules";

export function pathExists(s: GameState, p: PlayerId): boolean {
    const start = s.pawn[p];
    const seen = new Set<string>();
    const q: Pos[] = [start];
    const key = (x: Pos) => `${x.r},${x.c}`;

    while (q.length) {
        const u = q.shift()!;
        if (isGoal(s, p, u)) return true;
        const k = key(u);
        if (seen.has(k)) continue;
        seen.add(k);
        for (const v of neighbors(s, u)) {
            const kv = key(v);
            if (!seen.has(kv)) q.push(v);
        }
    }
    return false;
}

/**
 * Devuelve la distancia mínima (número de pasos) desde la posición actual del
 * jugador p hasta su meta, considerando únicamente muros (ignora al rival).
 * Si no hay camino —que no debería suceder con reglas válidas— retorna Infinity.
 */
export function shortestDistanceToGoal(s: GameState, p: PlayerId): number {
    const start = s.pawn[p];
    const n = s.size;
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const q: Pos[] = [start];
    dist[start.r][start.c] = 0;

    while (q.length) {
        const u = q.shift()!;
        if (isGoal(s, p, u)) return dist[u.r][u.c];
        for (const v of neighbors(s, u)) {
            if (dist[v.r][v.c] !== Infinity) continue;
            dist[v.r][v.c] = dist[u.r][u.c] + 1;
            q.push(v);
        }
    }
    return Infinity;
}
