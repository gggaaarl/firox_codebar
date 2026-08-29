-- Firox: tabla de prendas
-- Ejecutá esto en Supabase → SQL Editor → New query → Run

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

-- Storage: creá el bucket "product-images" en Supabase → Storage → New bucket
-- Marcá el bucket como Public para que las fotos se vean en la web.
