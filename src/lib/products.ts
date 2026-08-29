import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { generateBarcodeValue } from "@/lib/barcode";
import type { Product, ProductInput } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readProducts(): Promise<Product[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeProducts(products: Product[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function getProducts(): Promise<Product[]> {
  const products = await readProducts();
  return products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await readProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const products = await readProducts();
  const now = new Date().toISOString();
  const barcode = generateBarcodeValue(
    input.year,
    input.description,
    input.gender,
    input.size
  );

  const duplicate = products.find((product) => product.barcode === barcode);
  if (duplicate) {
    throw new Error("Ya existe una prenda con este código de barras.");
  }

  const product: Product = {
    id: uuidv4(),
    year: input.year,
    description: input.description,
    gender: input.gender,
    size: input.size,
    barcode,
    imageUrl: input.imageUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };

  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Prenda no encontrada.");
  }

  const barcode = generateBarcodeValue(
    input.year,
    input.description,
    input.gender,
    input.size
  );

  const duplicate = products.find(
    (product) => product.barcode === barcode && product.id !== id
  );
  if (duplicate) {
    throw new Error("Ya existe otra prenda con este código de barras.");
  }

  const updated: Product = {
    ...products[index],
    ...input,
    barcode,
    imageUrl: input.imageUrl ?? null,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await readProducts();
  const filtered = products.filter((product) => product.id !== id);

  if (filtered.length === products.length) {
    throw new Error("Prenda no encontrada.");
  }

  await writeProducts(filtered);
}
