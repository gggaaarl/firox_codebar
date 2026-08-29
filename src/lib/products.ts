import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { generateBarcodeValue } from "@/lib/barcode";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import type { Product, ProductInput } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

type DbRow = {
  id: string;
  year: string;
  description: string;
  gender: Product["gender"];
  size: string;
  barcode: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: DbRow): Product {
  return {
    id: row.id,
    year: row.year,
    description: row.description,
    gender: row.gender,
    size: row.size,
    barcode: row.barcode,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readLocalProducts(): Promise<Product[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Product[];
}

async function writeLocalProducts(products: Product[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

function buildBarcode(input: ProductInput): string {
  return generateBarcodeValue(
    input.year,
    input.description,
    input.gender,
    input.size
  );
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getProducts:", error.message);
      return [];
    }
    return (data as DbRow[]).map(mapRow);
  }

  const products = await readLocalProducts();
  return products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getProduct:", error.message);
      return null;
    }
    return data ? mapRow(data as DbRow) : null;
  }

  const products = await readLocalProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const barcode = buildBarcode(input);
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert({
        year: input.year,
        description: input.description,
        gender: input.gender,
        size: input.size,
        barcode,
        image_url: input.imageUrl ?? null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Ya existe una prenda con este código de barras.");
      }
      throw new Error(error.message);
    }

    return mapRow(data as DbRow);
  }

  const products = await readLocalProducts();
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
  await writeLocalProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Product> {
  const barcode = buildBarcode(input);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .update({
        year: input.year,
        description: input.description,
        gender: input.gender,
        size: input.size,
        barcode,
        image_url: input.imageUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Prenda no encontrada.");
      }
      if (error.code === "23505") {
        throw new Error("Ya existe otra prenda con este código de barras.");
      }
      throw new Error(error.message);
    }

    return mapRow(data as DbRow);
  }

  const products = await readLocalProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Prenda no encontrada.");
  }

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
  await writeLocalProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw new Error(error.message);
    if (!count) throw new Error("Prenda no encontrada.");
    return;
  }

  const products = await readLocalProducts();
  const filtered = products.filter((product) => product.id !== id);

  if (filtered.length === products.length) {
    throw new Error("Prenda no encontrada.");
  }

  await writeLocalProducts(filtered);
}
