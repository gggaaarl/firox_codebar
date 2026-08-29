import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Store } from "lucide-react";

export default async function CatalogPage() {
  const products = await getProducts();
  const withImages = products.filter((product) => product.imageUrl);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-stone-900 px-8 py-16 text-white sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,113,133,0.35),transparent_55%)]" />
        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
            <Sparkles className="size-4 text-rose-300" />
            Vista previa comercial
          </div>
          <h1 className="font-heading text-4xl font-semibold sm:text-5xl">
            Así luciría tu colección en la web
          </h1>
          <p className="text-lg text-stone-300">
            Cada prenda con foto personalizada puede convertirse en un producto
            de tu futura tienda online. Esta vista demuestra el potencial visual
            de tu catálogo.
          </p>
          <Link
            href="/panel/nuevo"
            className={cn(buttonVariants(), "bg-rose-500 hover:bg-rose-600")}
          >
            Agregar otra prenda
          </Link>
        </div>
      </section>

      {withImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white px-6 py-20 text-center">
          <Store className="mb-4 size-12 text-stone-300" />
          <h2 className="font-heading text-2xl font-semibold text-stone-900">
            Aún no hay fotos en el catálogo
          </h2>
          <p className="mt-2 max-w-md text-stone-600">
            Sube imágenes a tus prendas para ver cómo se verían expuestas en una
            web comercial moderna.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
                Colección destacada
              </p>
              <h2 className="font-heading text-3xl font-semibold text-stone-900">
                Nuevos ingresos
              </h2>
            </div>
            <p className="text-sm text-stone-500">
              {withImages.length} producto{withImages.length !== 1 ? "s" : ""} con
              foto
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {withImages.map((product) => (
              <ProductCard key={product.id} product={product} variant="catalog" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
