import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProduct, getProducts } from "@/lib/products";
import type { ProductInput } from "@/lib/types";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al crear la prenda";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
