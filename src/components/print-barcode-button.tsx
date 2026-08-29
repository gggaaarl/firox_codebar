"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BarcodeDisplay } from "@/components/barcode-display";
import { Button } from "@/components/ui/button";
import { downloadBarcodeAsPng } from "@/lib/barcode-download";
import type { Product } from "@/lib/types";
import { Download, Loader2, Printer } from "lucide-react";

type PrintBarcodeButtonProps = {
  product: Product;
};

export function PrintBarcodeButton({ product }: PrintBarcodeButtonProps) {
  const [downloading, setDownloading] = useState(false);

  function handlePrint() {
    window.print();
  }

  async function handleDownload() {
    const svg = document.querySelector("#barcode-print svg");
    if (!(svg instanceof SVGSVGElement)) return;

    setDownloading(true);
    try {
      await downloadBarcodeAsPng(svg, product.barcode);
    } catch {
      toast.error("No se pudo descargar la imagen");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        onClick={handlePrint}
        className="w-full bg-stone-900 hover:bg-stone-800 sm:w-auto"
      >
        <Printer className="size-4" />
        Imprimir etiqueta
      </Button>
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full sm:w-auto"
      >
        {downloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Descargar imagen
      </Button>
    </div>
  );
}

export function BarcodePrintArea({ product }: PrintBarcodeButtonProps) {
  return (
    <div
      id="barcode-print"
      className="overflow-x-auto rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 print:border-0 print:p-0"
    >
      <div className="mb-4 hidden print:block">
        <p className="text-lg font-semibold">{product.description}</p>
        <p className="text-sm text-stone-600">
          {product.gender} · Talla {product.size} · {product.year}
        </p>
      </div>
      <BarcodeDisplay
        value={product.barcode}
        height={80}
        className="mx-auto block h-auto max-w-full"
      />
    </div>
  );
}
