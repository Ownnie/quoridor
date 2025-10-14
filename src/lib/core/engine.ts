import type { GameState, PlayerId, Pos } from "./types";
import { canMoveSimple, applyMoveSimple, canPlaceWall, applyPlaceWall } from "./rules";

export type Action =
    | { kind: "move"; player: PlayerId; to: Pos }
    | { kind: "placeWall"; player: PlayerId; h: boolean; r: number; c: number };

export function reduce(s: GameState, a: Action): GameState {
    if (s.winner !== null) return s;
    if (a.player !== s.turn) return s;

    if (a.kind === "move") {
        if (!canMoveSimple(s, a.player, a.to)) return s;
        return applyMoveSimple(s, a.player, a.to);
    }

    if (a.kind === "placeWall") {
        if (!canPlaceWall(s, a.player, a.h, a.r, a.c)) return s;
        return applyPlaceWall(s, a.player, a.h, a.r, a.c);
    }

    return s;
}
