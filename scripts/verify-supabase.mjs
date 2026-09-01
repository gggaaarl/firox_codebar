/**
 * Verifica conexión a Supabase sin imprimir secretos.
 * Uso: npm run verify:supabase
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

const checks = [];

function ok(name, detail = "") {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  checks.push({ name, ok: false, detail });
  console.log(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

console.log("Verificando conexión Supabase...\n");

if (!existsSync(resolve(root, ".env.local"))) {
  fail(".env.local", "archivo no encontrado");
  process.exit(1);
}
ok(".env.local", "archivo presente");

if (!url) fail("NEXT_PUBLIC_SUPABASE_URL", "falta");
else ok("NEXT_PUBLIC_SUPABASE_URL", url);

if (!key || key.includes("tu-service-role")) fail("SUPABASE_SERVICE_ROLE_KEY", "falta o placeholder");
else ok("SUPABASE_SERVICE_ROLE_KEY", "configurada (no se muestra)");

if (!url || !key) {
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

async function restGet(path, extraHeaders = {}) {
  const res = await fetch(`${url}${path}`, {
    headers: { ...headers, ...extraHeaders },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: res.ok, status: res.status, body, res };
}

const productsRes = await restGet("/rest/v1/products?select=*&limit=1", {
  Prefer: "count=exact",
});
if (productsRes.ok) {
  const count =
    productsRes.res.headers.get("content-range")?.split("/")[1] ?? "?";
  const cols =
    Array.isArray(productsRes.body) && productsRes.body[0]
      ? Object.keys(productsRes.body[0]).join(", ")
      : "(tabla vacía — esperado: cod_sistema, cod_local, codigo_barra, ...)";
  ok("Tabla products", `${count} filas — columnas: ${cols}`);
} else {
  fail("Tabla products", `${productsRes.status}`);
}

const usersRes = await restGet("/rest/v1/app_users?select=username&limit=1");
if (usersRes.ok) {
  const users = usersRes.body ?? [];
  ok(
    "Tabla app_users",
    users.length ? `admin: ${users[0].username}` : "sin usuarios aún"
  );
} else {
  fail("Tabla app_users", `${usersRes.status}`);
}

const bucketRes = await restGet(`/storage/v1/bucket/${bucket}`);
if (bucketRes.ok) {
  ok("Storage bucket", `${bucket} (público: ${bucketRes.body?.public ?? "?"})`);
} else {
  fail("Storage bucket", `${bucketRes.status}`);
}

const failed = checks.filter((c) => !c.ok).length;
console.log(
  failed === 0
    ? "\nConexión OK — Supabase responde correctamente."
    : `\n${failed} chequeo(s) fallaron.`
);
process.exit(failed === 0 ? 0 : 1);
