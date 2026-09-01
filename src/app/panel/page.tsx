import { getProducts } from "@/lib/products";
import { ProductInventory } from "@/components/product-inventory";

export default async function PanelPage() {
  const products = await getProducts();

  return <ProductInventory products={products} />;
}
