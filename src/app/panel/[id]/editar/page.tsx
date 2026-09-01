import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ProductForm } from "@/components/product-form";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          Editar prenda
        </p>
        <h1 className="font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
          {product.descripcion}
        </h1>
        <p className="mt-2 text-stone-600">
          Actualiza los datos del producto en inventario.
        </p>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  );
}
