import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function PanelPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
          Tus prendas
        </h1>
        {products.length > 0 && (
          <p className="text-sm text-stone-500">
            {products.length} prenda{products.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
