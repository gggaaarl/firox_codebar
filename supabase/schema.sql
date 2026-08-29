-- ============================================================
-- Firox — script único de base de datos (Supabase SQL Editor)
-- Proyecto: https://zeuktcfrfkaxlyauwjqf.supabase.co
-- Ejecutar una sola vez: New query → pegar → Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. PRENDAS (inventario + códigos de barras)
-- ------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  description text not null,
  gender text not null check (gender in ('Hombre', 'Mujer', 'Unisex')),
  size text not null,
  barcode text not null unique,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_barcode_idx on public.products (barcode);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- ------------------------------------------------------------
-- 2. USUARIOS (login interno, 2–10 personas del equipo)
--    Contraseñas hasheadas con bcrypt (no texto plano).
--    Crear el primer admin: npm run seed:admin (con .env.local)
-- ------------------------------------------------------------

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  display_name text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_users_username_idx on public.app_users (username);

-- ------------------------------------------------------------
-- 3. FOTOS (Storage, no es SQL — hacer en el dashboard)
--    Storage → New bucket → nombre: product-images → Public ✓
-- ============================================================
