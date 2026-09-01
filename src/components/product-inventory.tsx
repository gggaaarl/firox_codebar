"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Printer, Search, X } from "lucide-react";

const PAGE_SIZE = 50;

type ProductFilters = {
  codSistema: string;
  codLocal: string;
  codigoBarra: string;
  clase: string;
  descripcion: string;
  marca: string;
};

const EMPTY_FILTERS: ProductFilters = {
  codSistema: "",
  codLocal: "",
  codigoBarra: "",
  clase: "",
  descripcion: "",
  marca: "",
};

type ProductInventoryProps = {
  products: Product[];
};

function matchesFilter(value: string, filter: string) {
  if (!filter.trim()) return true;
  return value.toLowerCase().includes(filter.trim().toLowerCase());
}

export function ProductInventory({ products }: ProductInventoryProps) {
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return products
      .filter(
        (p) =>
          matchesFilter(p.codSistema, filters.codSistema) &&
          matchesFilter(p.codLocal, filters.codLocal) &&
          matchesFilter(p.codigoBarra, filters.codigoBarra) &&
          matchesFilter(p.clase, filters.clase) &&
          matchesFilter(p.descripcion, filters.descripcion) &&
          matchesFilter(p.marca, filters.marca)
      )
      .sort((a, b) => Number(a.codSistema) - Number(b.codSistema));
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFilters = Object.values(filters).some((v) => v.trim());

  function updateFilter(key: keyof ProductFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
            Productos
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {filtered.length} de {products.length} productos
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-black/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Search className="size-4 text-stone-500" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FilterField
              label="Cod. sistema"
              value={filters.codSistema}
              onChange={(v) => updateFilter("codSistema", v)}
              placeholder="Ej: 31203"
            />
            <FilterField
              label="Cod. local"
              value={filters.codLocal}
              onChange={(v) => updateFilter("codLocal", v)}
              placeholder="Ej: 11419"
            />
            <FilterField
              label="Código de barras"
              value={filters.codigoBarra}
              onChange={(v) => updateFilter("codigoBarra", v)}
              placeholder="Ej: 11419012"
            />
            <FilterField
              label="Clase"
              value={filters.clase}
              onChange={(v) => updateFilter("clase", v)}
              placeholder="Ej: CASACA"
            />
            <FilterField
              label="Descripción"
              value={filters.descripcion}
              onChange={(v) => updateFilter("descripcion", v)}
              placeholder="Buscar descripción..."
            />
            <FilterField
              label="Marca"
              value={filters.marca}
              onChange={(v) => updateFilter("marca", v)}
              placeholder="Ej: FIROX"
            />
          </div>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4 text-stone-600"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setPage(1);
              }}
            >
              <X className="size-4" />
              Limpiar filtros
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/80 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3 font-medium">Cod. sistema</th>
                <th className="px-4 py-3 font-medium">Cod. local</th>
                <th className="px-4 py-3 font-medium">Código barras</th>
                <th className="px-4 py-3 font-medium">Clase</th>
                <th className="px-4 py-3 font-medium">Descripción</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-stone-500"
                  >
                    No hay productos que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-stone-50 transition-colors hover:bg-stone-50/50"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {product.codSistema}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {product.codLocal}
                    </td>
                    <td className="max-w-[120px] truncate px-4 py-3 font-mono text-xs">
                      {product.codigoBarra}
                    </td>
                    <td className="px-4 py-3">{product.clase}</td>
                    <td className="max-w-[220px] truncate px-4 py-3">
                      {product.descripcion}
                    </td>
                    <td className="px-4 py-3">{product.marca || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatPrice(product.precioVenta)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/panel/${product.id}/imprimir`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "bg-stone-900 hover:bg-stone-800"
                        )}
                      >
                        <Printer className="size-4" strokeWidth={2} />
                        Imprimir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-500">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-stone-600">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}
