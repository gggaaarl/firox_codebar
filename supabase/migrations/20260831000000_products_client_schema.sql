-- Inventario Firox: esquema según Excel del cliente (10 columnas)

drop table if exists public.products cascade;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  cod_sistema text not null,
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

create index products_codigo_barra_idx on public.products (codigo_barra);
create index products_clase_idx on public.products (clase);
create index products_created_at_idx on public.products (created_at desc);

grant all on table public.products to postgres, service_role;
grant select, insert, update, delete on table public.products to authenticated;
grant select on table public.products to anon;
