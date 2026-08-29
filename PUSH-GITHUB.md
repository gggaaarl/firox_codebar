# Subir Firox a GitHub — 3 pasos

Tu repo está vacío: https://github.com/gggaaarl/firox_codebar  
El código ya está listo acá. Solo falta **loguearte en GitHub** y **subirlo**.

---

## Paso 1 — Abrí la terminal

En Cursor: menú **Terminal → New Terminal** (abajo en la pantalla).

---

## Paso 2 — Logueate en GitHub (solo la primera vez)

Copiá y pegá:

```bash
gh auth login
```

Respondé así cuando pregunte:

| Pregunta | Respuesta |
|---|---|
| GitHub.com o Enterprise? | **GitHub.com** |
| Protocol | **HTTPS** |
| Authenticate | **Login with a web browser** |
| Código | Copiá el código que te muestra y pegalo en el navegador |

Cuando diga "Logged in", seguí al paso 3.

> Si `gh` no existe, usá la **Opción B** al final de este archivo.

---

## Paso 3 — Subí el código

Copiá y pegá **todo junto**:

```bash
cd /workspace
git remote add github https://github.com/gggaaarl/firox_codebar.git 2>/dev/null || true
git push -u github main
```

Si todo salió bien, refrescá GitHub y vas a ver carpetas como `src/`, `package.json`, etc.

---

## Opción B — sin `gh` (con token)

1. GitHub → tu foto (arriba derecha) → **Settings**
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token** → marcá solo **repo** → Generate
4. Copiá el token (empieza con `ghp_...`)
5. En la terminal:

```bash
cd /workspace
git push https://TU_USUARIO:TU_TOKEN@github.com/gggaaarl/firox_codebar.git main
```

Reemplazá `TU_USUARIO` por `gggaaarl` y `TU_TOKEN` por el token que copiaste.

---

## Después del push

1. **Supabase** → SQL Editor → pegá `supabase/schema.sql` → Run  
2. **Supabase** → Storage → bucket `product-images` (público)  
3. **Vercel** → Import project → elegí `firox_codebar` → Deploy  

Variables para Vercel (las sacás de Supabase → Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://zeuktcfrfkaxlyauwjqf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=... (service_role, la secreta)
SUPABASE_STORAGE_BUCKET=product-images
AUTH_SECRET=... (texto aleatorio largo)
AUTH_USERNAME=admin
AUTH_PASSWORD=... (tu clave)
```
