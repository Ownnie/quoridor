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
