-- Permisos faltantes: service_role no podía leer/escribir products

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on table public.products to postgres, service_role;
grant select, insert, update, delete on table public.products to authenticated;

grant all on table public.app_users to postgres, service_role;
grant select on table public.app_users to authenticated;

grant select on table public.products to anon;
