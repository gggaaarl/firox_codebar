/**
 * Crea el usuario admin en Supabase (app_users).
 * Usa SEED_ADMIN_* de .env.local (solo desarrollo local).
 *
 * Uso: node scripts/seed-admin.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

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
const username = env.SEED_ADMIN_USERNAME ?? "admin";
const password = env.SEED_ADMIN_PASSWORD ?? "Firox2026";
const displayName = env.SEED_ADMIN_DISPLAY_NAME ?? "Administrador";

if (!url || !key || key.includes("tu-service-role")) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

const passwordHash = await bcrypt.hash(password, 12);

const res = await fetch(`${url}/rest/v1/app_users?on_conflict=username`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    username,
    password_hash: passwordHash,
    display_name: displayName,
    role: "admin",
    is_active: true,
  }),
});

if (!res.ok) {
  const body = await res.text();
  if (body.includes("app_users") && body.includes("schema cache")) {
    console.error(
      'La tabla app_users no existe. Ejecutá primero supabase/migrations/20260829000001_app_users.sql en Supabase.'
    );
  } else {
    console.error(`Error ${res.status}: ${body}`);
  }
  process.exit(1);
}

console.log(`Usuario "${username}" listo en app_users.`);
