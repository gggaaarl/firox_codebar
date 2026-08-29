import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          Nueva prenda
        </p>
        <h1 className="font-heading text-4xl font-semibold text-stone-900">
          Generar código de barras
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Completa los datos de la prenda y sube una foto. El código se generará
          automáticamente con el formato acordado.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
