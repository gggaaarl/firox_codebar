"use client";

import { BarcodeDisplay } from "@/components/barcode-display";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { Download, Printer } from "lucide-react";

type PrintBarcodeButtonProps = {
  product: Product;
};

export function PrintBarcodeButton({ product }: PrintBarcodeButtonProps) {
  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const svg = document.querySelector("#barcode-print svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${product.barcode}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={handlePrint} className="bg-stone-900 hover:bg-stone-800">
        <Printer className="size-4" />
        Imprimir etiqueta
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="size-4" />
        Descargar SVG
      </Button>
    </div>
  );
}

export function BarcodePrintArea({ product }: PrintBarcodeButtonProps) {
  return (
    <div
      id="barcode-print"
      className="rounded-2xl border border-stone-200 bg-white p-6 print:border-0 print:p-0"
    >
      <div className="mb-4 hidden print:block">
        <p className="text-lg font-semibold">{product.description}</p>
        <p className="text-sm text-stone-600">
          {product.gender} · Talla {product.size} · {product.year}
        </p>
      </div>
      <BarcodeDisplay value={product.barcode} height={80} className="mx-auto" />
    </div>
  );
}
