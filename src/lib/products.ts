import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import type { Product, ProductInput } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

type DbRow = {
  id: string;
  cod_sistema: number | string;
  cod_local: string;
  codigo_barra: string;
  clase: string;
  descripcion: string;
  marca: string;
  color: string;
  talla: string;
  unidad_medida: string;
  precio_venta: number;
  created_at: string;
  updated_at: string;
};

function mapRow(row: DbRow): Product {
  return {
    id: row.id,
    codSistema: String(row.cod_sistema),
    codLocal: row.cod_local,
    codigoBarra: row.codigo_barra,
    clase: row.clase,
    descripcion: row.descripcion,
    marca: row.marca,
    color: row.color,
    talla: row.talla,
    unidadMedida: row.unidad_medida,
    precioVenta: Number(row.precio_venta),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbRow(input: ProductInput) {
  return {
    cod_sistema: Number(input.codSistema) || 0,
    cod_local: input.codLocal,
    codigo_barra: input.codigoBarra,
    clase: input.clase,
    descripcion: input.descripcion,
    marca: input.marca,
    color: input.color,
    talla: input.talla,
    unidad_medida: input.unidadMedida,
    precio_venta: input.precioVenta,
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

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("cod_sistema", { ascending: true });

    if (error) {
      console.error("getProducts:", error.message);
      return [];
    }
    return (data as DbRow[])
      .map(mapRow)
      .sort((a, b) => Number(a.codSistema) - Number(b.codSistema));
  }

  const products = await readLocalProducts();
  return products.sort(
    (a, b) => Number(a.codSistema) - Number(b.codSistema)
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
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert(toDbRow(input))
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Ya existe un producto con este código de barras.");
      }
      throw new Error(error.message);
    }

    return mapRow(data as DbRow);
  }

  const products = await readLocalProducts();
  const duplicate = products.find(
    (product) => product.codigoBarra === input.codigoBarra
  );
  if (duplicate) {
    throw new Error("Ya existe un producto con este código de barras.");
  }

  const product: Product = {
    id: uuidv4(),
    ...input,
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
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .update({
        ...toDbRow(input),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Producto no encontrado.");
      }
      if (error.code === "23505") {
        throw new Error("Ya existe otro producto con este código de barras.");
      }
      throw new Error(error.message);
    }

    return mapRow(data as DbRow);
  }

  const products = await readLocalProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Producto no encontrado.");
  }

  const duplicate = products.find(
    (product) =>
      product.codigoBarra === input.codigoBarra && product.id !== id
  );
  if (duplicate) {
    throw new Error("Ya existe otro producto con este código de barras.");
  }

  const updated: Product = {
    ...products[index],
    ...input,
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
    if (!count) throw new Error("Producto no encontrado.");
    return;
  }

  const products = await readLocalProducts();
  const filtered = products.filter((product) => product.id !== id);

  if (filtered.length === products.length) {
    throw new Error("Producto no encontrado.");
  }

  await writeLocalProducts(filtered);
}
