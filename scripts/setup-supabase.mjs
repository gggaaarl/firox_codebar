/**
 * Bootstrap Supabase sin pegar SQL a mano.
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 *
 * La tabla se crea vía MCP (apply_migration) o este script usa la API de Storage
 * para el bucket. Para SQL completo, el agente usa Supabase MCP después del login OAuth.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
const bucket = env.SUPABASE_STORAGE_BUCKET ?? "product-images";

if (!url || !key || key.includes("tu-service-role")) {
  console.error(
    "Falta .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY reales."
  );
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

async function ensureBucket() {
  const listRes = await fetch(`${url}/storage/v1/bucket`, { headers });
  if (!listRes.ok) {
    throw new Error(`No se pudo listar buckets: ${listRes.status}`);
  }
  const buckets = await listRes.json();
  if (buckets.some((b) => b.name === bucket)) {
    console.log(`Bucket "${bucket}" ya existe.`);
    return;
  }
  const createRes = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: bucket, public: true }),
  });
  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`No se pudo crear bucket: ${createRes.status} ${body}`);
  }
  console.log(`Bucket "${bucket}" creado (público).`);
}

async function checkProductsTable() {
  const res = await fetch(`${url}/rest/v1/products?select=id&limit=1`, {
    headers: { ...headers, Prefer: "count=exact" },
  });
  if (res.status === 404 || res.status === 400) {
    console.log(
      'Tabla "products" no existe aún. Pedile al agente que aplique la migración con Supabase MCP.'
    );
    return false;
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error consultando products: ${res.status} ${body}`);
  }
  console.log('Tabla "products" OK.');
  return true;
}

try {
  await ensureBucket();
  await checkProductsTable();
  console.log("Setup parcial listo.");
} catch (err) {
  console.error(err.message ?? err);
  process.exit(1);
}
