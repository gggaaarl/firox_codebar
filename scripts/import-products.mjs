/**
 * Importa productos desde docs/Lista-Productos.xlsx a Supabase.
 * Ejecutar DESPUÉS de npm run db:migrate
 *
 * Uso: npm run import:products
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const excelPath = resolve(root, "docs/Lista-Productos.xlsx");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = { ...process.env, ...loadEnvLocal() };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || key.includes("tu-service-role")) {
  console.error("Falta .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!existsSync(excelPath)) {
  console.error(`No se encontró ${excelPath}`);
  process.exit(1);
}

function cell(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return String(row[key]).trim();
    }
  }
  return "";
}

function parsePrecio(value) {
  if (value === undefined || value === null || value === "") return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const products = [];
const seen = new Set();

for (const row of rows) {
  const codigoBarra = cell(row, "CODIGO_BARRA", "CODIGO");
  if (!codigoBarra) continue;
  if (seen.has(codigoBarra)) continue;
  seen.add(codigoBarra);

  products.push({
    cod_sistema: Number(cell(row, "CODSISTEMA")) || 0,
    cod_local: cell(row, "COD_LOCAL"),
    codigo_barra: codigoBarra,
    clase: cell(row, "CLASE"),
    descripcion: cell(row, "DESCRIPCION"),
    marca: cell(row, "MARCA"),
    color: cell(row, "COLOR"),
    talla: cell(row, "TALLA"),
    unidad_medida: cell(row, "UNIDADMEDIDA") || "UND",
    precio_venta: parsePrecio(row.PRECIOVENTA),
  });
}

console.log(`Filas en Excel: ${rows.length}`);
console.log(`Productos a importar: ${products.length}`);

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: sample, error: schemaError } = await supabase
  .from("products")
  .select("codigo_barra")
  .limit(1);

if (schemaError) {
  console.error("Error leyendo products:", schemaError.message);
  console.error("¿Aplicaste la migración? → npm run db:migrate");
  process.exit(1);
}

if (sample !== null) {
  const { error: truncateError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (truncateError) {
    console.error("No se pudo vaciar products:", truncateError.message);
    process.exit(1);
  }
  console.log("Tabla products vaciada antes de importar.");
}

const BATCH = 500;
let inserted = 0;

for (let i = 0; i < products.length; i += BATCH) {
  const batch = products.slice(i, i + BATCH);
  const { error } = await supabase.from("products").insert(batch);
  if (error) {
    console.error(`Error en lote ${i / BATCH + 1}:`, error.message);
    process.exit(1);
  }
  inserted += batch.length;
  console.log(`Insertados ${inserted}/${products.length}...`);
}

console.log(`Importación completa: ${inserted} productos.`);
