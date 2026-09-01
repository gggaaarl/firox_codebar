"use client";

import { useState } from "react";
import Link from "next/link";
import { LabelPreview } from "@/components/label-preview";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowLeft, Printer } from "lucide-react";

type PrintProductClientProps = {
  product: Product;
};

export function PrintProductClient({ product }: PrintProductClientProps) {
  const [talla, setTalla] = useState(product.talla || "");

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/panel"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 w-fit"
            )}
          >
            <ArrowLeft className="size-4" />
            Volver a productos
          </Link>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
              Imprimir etiqueta
            </p>
            <h1 className="font-heading text-2xl font-semibold text-stone-900 sm:text-3xl">
              {product.descripcion}
            </h1>
            <p className="mt-1 font-mono text-sm text-stone-500">
              {product.codigoBarra}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 print:block">
        <Card className="border-0 shadow-sm ring-1 ring-black/5 print:hidden">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Opciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="talla">Talla a imprimir</Label>
              <Input
                id="talla"
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                placeholder="Ej: M, L, 42..."
              />
              <p className="text-xs text-stone-500">
                Talla del producto en inventario:{" "}
                <strong>{product.talla || "sin talla"}</strong>
              </p>
            </div>

            <Button
              type="button"
              onClick={handlePrint}
              disabled={!talla.trim()}
              className="w-full bg-stone-900 hover:bg-stone-800 sm:w-auto"
            >
              <Printer className="size-4" strokeWidth={2} />
              Imprimir etiqueta
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm ring-1 ring-black/5 print:border-0 print:shadow-none print:ring-0">
          <CardHeader className="print:hidden">
            <CardTitle className="font-heading text-lg">
              Previsualización
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center bg-stone-100/80 p-8 print:bg-white print:p-0">
            <LabelPreview
              codigoBarra={product.codigoBarra}
              descripcion={product.descripcion}
              talla={talla}
              precioVenta={product.precioVenta}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
