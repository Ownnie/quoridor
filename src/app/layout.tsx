import "./globals.css"

export const metadata = {
  title: "Quoridor — Analisis de Algoritmos",
  description: "UI sobria con agente sintético (baseline).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-neutral-900 text-neutral-100 antialiased selection:bg-red-500/30">
        {children}
      </body>
    </html>
  );
}
