export type PlayerId = 0 | 1;
export type Mode = "cpu" | "pvp";

export interface Pos { r: number; c: number; }

export interface GameConfig {
    size: number;
    wallsPerPlayer: number;
    mode: Mode;
}

export interface GameState {
    size: number;
    turn: PlayerId;
    pawn: [Pos, Pos];
    wallsLeft: [number, number];
    // bloqueo de canales
    H: boolean[][];                 // 8x9  (horizontal)
    V: boolean[][];                 // 9x8  (vertical)
    // NUEVO: dueño del segmento (quién lo colocó) para colorear muros
    HO: (PlayerId | null)[][];      // 8x9
    VO: (PlayerId | null)[][];      // 9x8
    winner: PlayerId | null;
}
