import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Shirt } from "lucide-react";

export default async function PanelPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
            Panel de control
          </p>
          <h1 className="font-heading text-4xl font-semibold text-stone-900">
            Tus prendas
          </h1>
          <p className="mt-2 max-w-2xl text-stone-600">
            Administra los códigos de barras de tu inventario. Cada prenda puede
            incluir una foto personalizada para reutilizar en tu web comercial.
          </p>
        </div>
        <Link
          href="/panel/nuevo"
          className={cn(buttonVariants(), "bg-rose-500 hover:bg-rose-600")}
        >
          <Plus className="size-4" />
          Nueva prenda
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white px-6 py-20 text-center shadow-sm">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-stone-100">
            <Shirt className="size-8 text-stone-400" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-stone-900">
            Aún no hay prendas registradas
          </h2>
          <p className="mt-2 max-w-md text-stone-600">
            Crea tu primera prenda para generar un código de barras con formato
            año-descripción-sexo-talla.
          </p>
          <Link
            href="/panel/nuevo"
            className={cn(buttonVariants(), "mt-6 bg-stone-900 hover:bg-stone-800")}
          >
            <Plus className="size-4" />
            Crear primera prenda
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              {products.length} prenda{products.length !== 1 ? "s" : ""} registrada
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
