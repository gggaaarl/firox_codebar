"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Barcode, Eye, Pencil } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(value);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden bg-stone-100 p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="secondary" className="bg-white/90 text-stone-700">
            {product.clase}
          </Badge>
          <p className="text-sm font-semibold text-stone-900">
            {formatPrice(product.precioVenta)}
          </p>
        </div>
        <div className="space-y-1">
          <Barcode className="size-8 text-stone-400" />
          <p className="font-mono text-xs text-stone-600">{product.codigoBarra}</p>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-rose-500">
            {product.marca || "Sin marca"}
          </p>
          <h3 className="font-heading line-clamp-2 text-lg font-semibold text-stone-900">
            {product.descripcion}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.color && (
            <Badge variant="secondary" className="bg-stone-100 text-stone-700">
              {product.color}
            </Badge>
          )}
          {product.talla && (
            <Badge variant="secondary" className="bg-stone-100 text-stone-700">
              Talla {product.talla}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-stone-100 text-stone-700">
            {product.unidadMedida}
          </Badge>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/panel/${product.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex-1"
            )}
          >
            <Eye className="size-4" />
            Ver código
          </Link>
          <Link
            href={`/panel/${product.id}/editar`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "flex-1 bg-stone-900 hover:bg-stone-800"
            )}
          >
            <Pencil className="size-4" />
            Editar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
