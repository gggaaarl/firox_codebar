import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { PrintProductClient } from "@/components/print-product-client";

type PrintProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PrintProductPage({ params }: PrintProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <PrintProductClient product={product} />;
}
