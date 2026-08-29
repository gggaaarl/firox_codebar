"use client";

import { Button } from "@/components/ui/button";

export default function PanelError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
      <h2 className="font-heading text-2xl font-semibold text-stone-900">
        No se pudo cargar el panel
      </h2>
      <p className="mt-2 text-stone-600">
        Hubo un error al conectar con la base de datos. Probá de nuevo.
      </p>
      <Button onClick={reset} className="mt-6 bg-stone-900 hover:bg-stone-800">
        Reintentar
      </Button>
    </div>
  );
}
