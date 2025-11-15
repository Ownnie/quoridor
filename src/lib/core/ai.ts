import type { GameState, PlayerId } from "./types";
import type { Action } from "./engine";
import { legalMoves, applyMove, canPlaceWall, applyPlaceWall } from "./rules";
import { shortestDistanceToGoal } from "./bfs";

function evaluate(s: GameState, player: PlayerId): number {
    // Más pequeño es mejor para 'player': prioriza acercarse y alejar al rival.
    const me = shortestDistanceToGoal(s, player);
    const op = shortestDistanceToGoal(s, (player === 0 ? 1 : 0) as PlayerId);
    return me - op;
}

function simulate(s: GameState, a: Action): GameState {
    if (a.kind === "move") return applyMove(s, a.player, a.to);
    return applyPlaceWall(s, a.player, a.h, a.r, a.c);
}

export function enumerateActions(s: GameState, player: PlayerId): Action[] {
    const actions: Action[] = [];
    // Movimientos
    for (const to of legalMoves(s, player)) actions.push({ kind: "move", player, to });
    // Muros (si quedan)
    if (s.wallsLeft[player] > 0) {
        const n = s.size;
        for (let r = 0; r <= n - 2; r++) {
            for (let c = 0; c <= n - 2; c++) {
                if (canPlaceWall(s, player, true, r, c)) actions.push({ kind: "placeWall", player, h: true, r, c });
                if (canPlaceWall(s, player, false, r, c)) actions.push({ kind: "placeWall", player, h: false, r, c });
            }
        }
    }
    return actions;
}

/** Selección codiciosa: elige la acción que minimiza (distancia propia - distancia rival). */
export function chooseGreedyAction(s: GameState, player: PlayerId): Action | null {
    const actions = enumerateActions(s, player);
    if (actions.length === 0) return null;

    let best: Action = actions[0];
    let bestScore = Infinity;

    for (const a of actions) {
        const next = simulate(s, a);
        const score = evaluate(next, player);
        // Desempate simple: preferir movimiento frente a muro con la misma evaluación
        if (score < bestScore || (score === bestScore && a.kind === "move" && best.kind !== "move")) {
            bestScore = score;
            best = a;
        }
    }
    return best;
}
