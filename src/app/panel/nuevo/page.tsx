import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          Nuevo producto
        </p>
        <h1 className="font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
          Registrar producto
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Completa los datos del inventario. El código de barras viene del Excel
          o se ingresa manualmente.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
