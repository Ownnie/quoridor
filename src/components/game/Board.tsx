"use client";

import { Cell } from "./Cell";
import { WallSlotH, WallSlotV, TRACK_PX } from "./WallSlot";
import { useGame } from "@/lib/store/gameStore";

function ownerColor(owner: 0 | 1 | null | undefined) {
    if (owner === 0) return "bg-[var(--accent-red)]";
    if (owner === 1) return "bg-[var(--accent-blue)]";
    return "bg-neutral-700";
}
function previewColor(legal: boolean) {
    return legal ? "bg-white" : "bg-red-600";
}

/**
 * Rejilla intercalada (2n-1)x(2n-1):
 * - pares: celdas (1fr)
 * - impares: pistas TRACK_PX (muros)
 * - gap simétrico
 * Siempre renderizamos el botón del slot; preview/colocado se dibujan como overlay (no bloquea clic).
 */
export function Board({ size = 9 }: { size?: number }) {
    const { state, wallPreview, setWallPreview } = useGame();
    const N = size;
    const G = 2 * N - 1;

    const rows = Array.from({ length: G }, (_, i) => (i % 2 === 0 ? "1fr" : `${TRACK_PX}px`)).join(" ");
    const cols = Array.from({ length: G }, (_, j) => (j % 2 === 0 ? "1fr" : `${TRACK_PX}px`)).join(" ");

    return (
        <div className="w-full max-w-[min(92dvw,92dvh)]">
            <div
                onMouseLeave={() => setWallPreview(null)}
                className="grid aspect-square gap-1 rounded-2xl bg-neutral-950/50 p-3 shadow-xl"
                style={{ gridTemplateColumns: cols, gridTemplateRows: rows }}
            >
                {Array.from({ length: G }).flatMap((_, i) =>
                    Array.from({ length: G }).map((__, j) => {
                        const evenI = i % 2 === 0;
                        const evenJ = j % 2 === 0;

                        // CELDA
                        if (evenI && evenJ) {
                            const r = i / 2;
                            const c = j / 2;
                            return (
                                <div key={`${i}-${j}`} className="relative">
                                    <div className="pointer-events-none absolute inset-0 rounded-lg border border-neutral-800 bg-neutral-900/70" />
                                    <Cell r={r} c={c} />
                                </div>
                            );
                        }

                        // SLOT HORIZONTAL (odd, even) – sección c
                        if (!evenI && evenJ) {
                            const r = (i - 1) / 2;
                            const c = j / 2;

                            const placed = state.H[r]?.[c] === true;
                            const owner = state.HO[r]?.[c] ?? null;

                            // preview para el ancla activo: c0 y c0+1
                            let pvClass = "";
                            if (wallPreview?.h && wallPreview.r === r) {
                                const { c: c0, legal } = wallPreview;
                                if (c === c0 || c === c0 + 1) pvClass = previewColor(legal);
                            }

                            // ancla: última sección usa c-1; en otro caso usa c
                            const anchorC = c === N - 1 ? c - 1 : c;

                            return (
                                <div key={`${i}-${j}`} className="relative h-full w-full">
                                    {/* overlay: colocado / preview (no bloquea el click) */}
                                    {placed && (
                                        <div className={`pointer-events-none absolute z-10 inset-0 rounded-[4px] ${ownerColor(owner)}`} />
                                    )}
                                    {!placed && pvClass && (
                                        <div className={`pointer-events-none absolute z-10 inset-0 rounded-[4px]  ${pvClass}`} />
                                    )}
                                    {/* botón SIEMPRE presente */}
                                    <WallSlotH r={r} anchorC={anchorC} />
                                </div>
                            );
                        }

                        // SLOT VERTICAL (even, odd) – sección r
                        if (evenI && !evenJ) {
                            const r = i / 2;
                            const c = (j - 1) / 2;

                            const placed = state.V[r]?.[c] === true;
                            const owner = state.VO[r]?.[c] ?? null;

                            let pvClass = "";
                            if (wallPreview && !wallPreview.h && wallPreview.c === c) {
                                const { r: r0, legal } = wallPreview;
                                if (r === r0 || r === r0 + 1) pvClass = previewColor(legal);
                            }

                            const anchorR = r === N - 1 ? r - 1 : r;

                            return (
                                <div key={`${i}-${j}`} className="relative h-full w-full">
                                    {placed && (
                                        <div className={`pointer-events-none absolute inset-0 rounded-[4px] ${ownerColor(owner)}`} />
                                    )}
                                    {!placed && pvClass && (
                                        <div className={`pointer-events-none absolute inset-0 rounded-[4px] ${pvClass}`} />
                                    )}
                                    <WallSlotV c={c} anchorR={anchorR} />
                                </div>
                            );
                        }

                        // INTERSECCIÓN (gris redondeada)
                        return <div key={`${i}-${j}`} className="h-full w-full rounded-[4px] bg-neutral-700" />;
                    })
                )}
            </div>
        </div>
    );
}
