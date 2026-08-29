"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Barcode, Eye, Pencil } from "lucide-react";

type ProductCardProps = {
  product: Product;
  variant?: "dashboard" | "catalog";
};

export function ProductCard({ product, variant = "dashboard" }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.description}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-stone-400">
            <Barcode className="size-10" />
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="font-mono text-xs text-white/90">{product.barcode}</p>
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-rose-500">
              {product.year}
            </p>
            <h3 className="font-heading text-lg font-semibold text-stone-900">
              {product.description}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-stone-100 text-stone-700">
            {product.gender}
          </Badge>
          <Badge variant="secondary" className="bg-stone-100 text-stone-700">
            Talla {product.size}
          </Badge>
        </div>

        {variant === "dashboard" && (
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
        )}
      </CardContent>
    </Card>
  );
}
