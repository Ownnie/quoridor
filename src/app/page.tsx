"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ModeSelectionPage() {
  const [mode, setMode] = useState<"pvp" | "cpu">("pvp");

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-10 px-6">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Quoridor</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Selecciona el modo de juego y continúa.
        </p>
      </header>

      <section className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/50 p-6 shadow-lg">
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer rounded-xl border p-4 transition
              ${mode === "pvp" ? "border-neutral-500 bg-neutral-800/50" : "border-neutral-800 hover:border-neutral-700"}`}
          >
            <input
              type="radio"
              name="mode"
              value="pvp"
              checked={mode === "pvp"}
              onChange={() => setMode("pvp")}
              className="hidden"
            />
            <div className="flex items-start gap-3">
              <div className="mt-1 size-3 rounded-full border border-neutral-500">
                {mode === "pvp" && <div className="size-3 rounded-full bg-neutral-300" />}
              </div>
              <div>
                <div className="font-medium">Persona vs Persona</div>
                <div className="text-sm text-neutral-400">
                  Ambos humanos (rojo vs azul).
                </div>
              </div>
            </div>
          </label>

          <label
            className={`cursor-pointer rounded-xl border p-4 transition
              ${mode === "cpu" ? "border-neutral-500 bg-neutral-800/50" : "border-neutral-800 hover:border-neutral-700"}`}
          >
            <input
              type="radio"
              name="mode"
              value="cpu"
              checked={mode === "cpu"}
              onChange={() => setMode("cpu")}
              className="hidden"
            />
            <div className="flex items-start gap-3">
              <div className="mt-1 size-3 rounded-full border border-neutral-500">
                {mode === "cpu" && <div className="size-3 rounded-full bg-neutral-300" />}
              </div>
              <div>
                <div className="font-medium">Persona vs Máquina</div>
                <div className="text-sm text-neutral-400">
                  Jugador 1 (rojo) es humano, Jugador 2 (azul) es CPU.
                </div>
              </div>
            </div>
          </label>

        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            href={{
              pathname: "/game",
              query: { mode },
            }}
          >
            <Button>Continuar</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
