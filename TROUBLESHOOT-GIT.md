# Si falló la autenticación de GitHub

## Por qué pasa

Hay **dos cosas distintas**:

1. **Cursor conectado a GitHub** (login en la app)
2. **Git subiendo código** (`git push`)

A veces Cursor está logueado pero la **terminal no**, o al revés. En esta sesión de agente en la nube, **GitHub no está logueado** en la terminal — por eso el push falla.

---

## Solución más confiable — Token (5 minutos)

No usa navegador ni OAuth. Funciona casi siempre.

### A) Crear el token en GitHub

1. Entrá a https://github.com/settings/tokens
2. **Generate new token** → **Generate new token (classic)**
3. Nombre: `cursor-firox`
4. Expiration: 90 days (o lo que prefieras)
5. Marcá solo: **repo** ✓
6. **Generate token**
7. **Copiá el token** (empieza con `ghp_...`) — solo se muestra una vez

### B) Pegarlo en la terminal de Cursor

Abrí **Terminal → New Terminal** y ejecutá (reemplazá `ghp_TU_TOKEN`):

```bash
echo "ghp_TU_TOKEN" | gh auth login --with-token
```

Debería terminar sin error.

### C) Subir el código

```bash
cd /workspace
git push -u github main
```

### D) Verificar

```bash
gh auth status
```

Debería decir: `Logged in to github.com as gggaaarl`

Refrescá https://github.com/gggaaarl/firox_codebar

---

## Si Cursor sigue sin conectar GitHub (la app)

En **tu computadora** (Cursor desktop):

1. **Cursor Settings** (engranaje abajo a la izquierda)
2. **Account** o **General**
3. Buscá **GitHub** → **Sign out** / Desconectar
4. Cerrá y abrí Cursor
5. Volvé a **Connect GitHub** → autorizá en el navegador

Si el navegador no abre:

- Desactivá bloqueadores de popups para `cursor.com` y `github.com`
- Probá otro navegador (Chrome suele ir mejor)
- Entrá manualmente a https://github.com/login/device si te da un código

---

## Errores comunes

| Mensaje | Qué hacer |
|---|---|
| `could not read Username` | No hay login. Usá el token (pasos de arriba). |
| `Authentication failed` | Token mal copiado o expirado. Generá uno nuevo. |
| `Repository not found` | Repo privado sin permiso, o URL mal escrita. |
| `Updates were rejected` | Alguien pusheó antes. `git pull github main --rebase` y volvé a push. |
| `remote github already exists` | Normal. Seguí con `git push -u github main`. |

---

## Alternativa sin `gh`

Si `gh auth login` no funciona, push directo con token:

```bash
git push https://gggaaarl:ghp_TU_TOKEN@github.com/gggaaarl/firox_codebar.git main
```

Después configurá el remote para no pegar el token cada vez:

```bash
git remote set-url github https://gggaaarl:ghp_TU_TOKEN@github.com/gggaaarl/firox_codebar.git
git push -u github main
```

> No subas el token al repo. No lo compartas en chats públicos.

---

## Orden cuando ya funcione

1. ✅ Código en GitHub  
2. Supabase → SQL `supabase/schema.sql` + bucket `product-images`  
3. Vercel → Import `firox_codebar` → variables → Deploy  
