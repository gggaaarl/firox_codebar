# Guía de despliegue — Firox

Pasos para subir el código a GitHub, conectar Supabase y publicar en Vercel.

---

## 1. GitHub (subir el código) — versión simple

**Qué es:** GitHub guarda tu código en la nube, como un Google Drive para programadores.

**Tu repo:** https://github.com/gggaaarl/firox_codebar

### Opción fácil (desde Cursor)

1. Abrí la terminal en Cursor (menú **Terminal → New Terminal**)
2. Pegá esto y apretá Enter:

```bash
git push -u github main
```

3. Si te pide login → entrá con tu cuenta de GitHub (se abre el navegador)
4. Listo. Refrescá la página de GitHub y vas a ver todos los archivos

### Si dice que `github` no existe

Pegá esto primero:

```bash
git remote add github https://github.com/gggaaarl/firox_codebar.git
git push -u github main
```

### Si falla porque el repo tiene README

```bash
git pull github main --allow-unrelated-histories
git push -u github main
```

---

## 2. Supabase (base de datos + fotos)

### Paso A — Crear proyecto

1. Entrá a https://supabase.com → **New project**
2. Elegí nombre (ej. `firox`), contraseña de DB, región cercana (ej. South America)
3. Esperá ~2 min a que termine de crearse

### Paso B — Crear la tabla

1. En el menú izquierdo: **SQL Editor**
2. **New query**
3. Copiá y pegá todo el contenido de `supabase/schema.sql` de este repo
4. **Run**

### Paso C — Crear bucket de fotos

1. Menú **Storage** → **New bucket**
2. Nombre: `product-images`
3. Marcá **Public bucket** ✓
4. Create

### Paso D — Copiar las claves

1. **Project Settings** (engranaje) → **API**
2. Anotá:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> No compartas la `service_role` key públicamente. Solo va en Vercel como variable de entorno.

---

## 3. Vercel (publicar en la web)

### Paso A — Crear proyecto

1. Entrá a https://vercel.com → **Add New → Project**
2. **Import** el repo `gggaaarl/firox_codebar` desde GitHub
3. Framework: Next.js (lo detecta solo)

### Paso B — Variables de entorno

En **Environment Variables**, agregá estas (Production + Preview):

| Variable | Valor |
|---|---|
| `AUTH_SECRET` | Un texto largo aleatorio (ej. generá uno en https://generate-secret.vercel.app/32) |
| `AUTH_USERNAME` | `admin` (o el que quieras) |
| `AUTH_PASSWORD` | Tu contraseña de acceso |
| `NEXT_PUBLIC_SUPABASE_URL` | La URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | La service_role key de Supabase |
| `SUPABASE_STORAGE_BUCKET` | `product-images` |

### Paso C — Deploy

1. Click **Deploy**
2. En ~2 min tendrás una URL tipo `https://firox-codebar.vercel.app`
3. Entrá con tu usuario y contraseña

---

## 4. Orden recomendado

```
1. git push a GitHub     ← subís el código
2. Supabase              ← creás tabla + bucket
3. Vercel                ← importás repo + pegás variables
4. Deploy                ← queda online
```

---

## 5. Desarrollo local

```bash
npm install
cp .env.example .env.local
# Editá .env.local con tus valores
npm run dev
```

Sin Supabase configurado, la app usa archivos locales (`data/products.json` + `public/uploads/`).

Con Supabase configurado, usa la nube igual que en producción.

---

## Problemas comunes

**"could not read Username" al hacer push**  
→ Te falta loguearte. Corré `git push -u github main` y seguí el login en el navegador.

**Las fotos no se ven en Vercel**  
→ Revisá que el bucket `product-images` sea **público** y que `SUPABASE_STORAGE_BUCKET` esté bien escrito.

**Login no funciona en Vercel**  
→ Revisá que `AUTH_SECRET` esté configurado (obligatorio en producción).

**No hay prendas después del deploy**  
→ Normal si es DB nueva. Creá prendas desde el panel o migrá datos manualmente.
