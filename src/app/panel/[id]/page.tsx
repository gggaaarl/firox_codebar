import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteProductButton } from "@/components/delete-product-button";
import {
  BarcodePrintArea,
  PrintBarcodeButton,
} from "@/components/print-barcode-button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Pencil } from "lucide-react";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/panel"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 w-fit"
            )}
          >
            <ArrowLeft className="size-4" />
            Volver al panel
          </Link>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
              {product.year}
            </p>
            <h1 className="font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
              {product.description}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-stone-900">{product.gender}</Badge>
              <Badge variant="secondary">Talla {product.size}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={`/panel/${product.id}/editar`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
          >
            <Pencil className="size-4" />
            Editar
          </Link>
          <DeleteProductButton product={product} className="w-full sm:w-auto" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-black/5">
          <div className="relative aspect-[4/5] bg-stone-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.description}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">
                Sin imagen cargada
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm ring-1 ring-black/5">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Código de barras
                </p>
                <p className="break-all font-mono text-base font-semibold text-stone-900 sm:text-lg">
                  {product.barcode}
                </p>
              </div>
              <BarcodePrintArea product={product} />
              <PrintBarcodeButton product={product} />
            </CardContent>
          </Card>

          <Card className="border-0 bg-stone-900 text-white shadow-sm">
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-stone-300">Para tu sistema de facturación</p>
              <p className="text-sm leading-relaxed text-stone-200">
                Registra manualmente este mismo código en tu sistema de
                facturación electrónica. Ambos sistemas operan de forma
                independiente pero comparten el mismo identificador de prenda.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
