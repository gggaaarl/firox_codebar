"use client";

import Image from "next/image";
import { BarcodeDisplay } from "@/components/barcode-display";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type LabelPreviewProps = {
  codigoBarra: string;
  descripcion: string;
  talla: string;
  precioVenta: number;
  className?: string;
  id?: string;
};

export function LabelPreview({
  codigoBarra,
  descripcion,
  talla,
  precioVenta,
  className,
  id = "label-print",
}: LabelPreviewProps) {
  return (
    <div
      id={id}
      className={cn(
        "mx-auto flex w-[240px] flex-col items-center gap-2 bg-white p-3 text-center text-stone-900 shadow-sm ring-1 ring-stone-200",
        className
      )}
    >
      <Image
        src="/logo.jpg"
        alt="Firox"
        width={200}
        height={56}
        className="h-12 w-auto object-contain"
        priority
      />

      <div className="w-full overflow-hidden">
        <BarcodeDisplay
          value={codigoBarra}
          height={48}
          className="mx-auto block h-auto w-full max-w-full"
        />
      </div>

      <p className="w-full break-all font-mono text-[10px] leading-tight text-stone-700">
        {codigoBarra}
      </p>

      <p className="w-full text-xs font-semibold leading-snug uppercase">
        {descripcion}
      </p>

      <p className="text-sm font-bold tracking-wide">TALLA {talla || "—"}</p>

      <p className="text-lg font-bold text-stone-900">
        {formatPrice(precioVenta)}
      </p>
    </div>
  );
}
