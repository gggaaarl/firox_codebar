-- ============================================================
-- Firox — script único de base de datos (Supabase SQL Editor)
-- Proyecto: https://zeuktcfrfkaxlyauwjqf.supabase.co
-- Ejecutar una sola vez: New query → pegar → Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. PRODUCTOS (inventario + códigos de barras)
-- ------------------------------------------------------------

drop table if exists public.products cascade;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  cod_sistema integer not null,
  cod_local text not null,
  codigo_barra text not null unique,
  clase text not null,
  descripcion text not null,
  marca text not null default '',
  color text not null default '',
  talla text not null default '',
  unidad_medida text not null default 'UND',
  precio_venta numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_cod_sistema_idx on public.products (cod_sistema);
create index products_codigo_barra_idx on public.products (codigo_barra);
create index products_clase_idx on public.products (clase);
create index products_created_at_idx on public.products (created_at desc);

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
-- 3. PERMISOS (PostgREST / service_role)
-- ------------------------------------------------------------

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on table public.products to postgres, service_role;
grant select, insert, update, delete on table public.products to authenticated;
grant select on table public.products to anon;

grant all on table public.app_users to postgres, service_role;
grant select on table public.app_users to authenticated;

-- ------------------------------------------------------------
-- 4. FOTOS (Storage, no es SQL — hacer en el dashboard)
--    Storage → New bucket → nombre: product-images → Public ✓
-- ============================================================
