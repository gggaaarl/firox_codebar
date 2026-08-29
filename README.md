# Firox — Códigos de barras

Web app interna para generar códigos de barras de ropa con fotos por prenda.

## Características

- Login con usuario y contraseña (sin OAuth)
- Generación automática de códigos CODE128 con formato **año-descripción-sexo-talla**
- Subida de fotos por prenda
- Panel de administración con listado de prendas
- Impresión y descarga de etiquetas en SVG

## Despliegue (Supabase + Vercel)

Guía paso a paso en **[DEPLOY.md](./DEPLOY.md)** — incluye GitHub, Supabase y Vercel explicado simple.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app corre en [http://localhost:4317](http://localhost:4317).

## Credenciales por defecto

Configura en `.env.local`:

```env
AUTH_SECRET=genera-un-secreto-largo-y-aleatorio
AUTH_USERNAME=admin
AUTH_PASSWORD=codigos2026
```

## Formato del código de barras

Ejemplo: `2026-POLERA-BASICA-ALGODON-MUJER-M`

Los segmentos se normalizan automáticamente (mayúsculas, sin acentos, espacios reemplazados por guiones).

## Flujo de trabajo

1. Ingresa con tu usuario y contraseña
2. Crea una prenda con año, descripción, sexo y talla
3. Sube una foto opcional de la prenda
4. Imprime o descarga la etiqueta con código de barras
5. Registra el mismo código manualmente en tu sistema de facturación

## Estructura

```
src/
  app/
    login/          # Pantalla de acceso
    panel/          # Dashboard protegido
  components/       # UI y formularios
  lib/              # Lógica de productos y códigos
data/
  products.json     # Datos locales
public/
  uploads/          # Imágenes subidas
```

## Notas

Esta app **no se integra** con el sistema de facturación existente. Ambos sistemas comparten el mismo identificador de prenda ingresado manualmente en cada uno.
