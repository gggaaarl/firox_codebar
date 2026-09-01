/**
 * Aplica un archivo .sql a Supabase vía conexión Postgres directa.
 * Requiere SUPABASE_DB_PASSWORD en .env.local (Settings → Database → password).
 *
 * Uso: npm run db:migrate
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

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
const password = env.SUPABASE_DB_PASSWORD;
const projectRef =
  env.SUPABASE_PROJECT_REF ??
  env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/
  )?.[1];

const sqlFile =
  process.argv[2] ??
  resolve(root, "supabase/migrations/20260831000000_products_client_schema.sql");

if (!password) {
  console.error(
    "Falta SUPABASE_DB_PASSWORD en .env.local\n" +
      "Supabase → Settings → Database → Database password"
  );
  process.exit(1);
}

if (!projectRef) {
  console.error("No se pudo detectar el project ref de NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}

const connectionString =
  env.DATABASE_URL ??
  (env.SUPABASE_DB_HOST
    ? `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${env.SUPABASE_DB_HOST}:6543/postgres`
    : `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`);

const sql = readFileSync(sqlFile, "utf8");
const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

console.log(`Aplicando migración: ${sqlFile}`);

try {
  await client.connect();
  await client.query(sql);
  console.log("Migración aplicada correctamente.");
} catch (err) {
  console.error("Error:", err.message ?? err);
  process.exit(1);
} finally {
  await client.end();
}
