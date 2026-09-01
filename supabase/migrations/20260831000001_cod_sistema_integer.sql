-- Ordenar inventario por CODSISTEMA numérico (1, 2, 3… no 1, 10, 100)

alter table public.products
  alter column cod_sistema type integer using cod_sistema::integer;

create index if not exists products_cod_sistema_idx on public.products (cod_sistema);
