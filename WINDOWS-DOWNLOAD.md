# Bajar Firox a tu PC (Windows)

El código **no está en tu computadora todavía**. Está en la nube de Cursor.
Por eso no ves nada en `C:\Users\CP32\Documents`.

---

## Opción 1 — Descargar el ZIP (más fácil ahora)

1. En Cursor, mirá el **explorador de archivos** a la izquierda
2. Buscá el archivo **`firox_codebar.zip`** (en la raíz del proyecto)
3. Click derecho → **Download** (Descargar)
4. En tu PC, abrí la carpeta **Descargas**
5. Click derecho en `firox_codebar.zip` → **Extraer todo…**
6. Elegí destino: `C:\Users\CP32\Documents`
7. Renombrá la carpeta extraída a **`firox_codebar`**

Ruta final:

```
C:\Users\CP32\Documents\firox_codebar
```

### Después de extraer

Abrí **Git Bash** y pegá:

```bash
cd /c/Users/CP32/Documents/firox_codebar
npm install
cp .env.example .env.local
npm run dev
```

Abrí http://localhost:4317

---

## Opción 2 — Con Git (cuando GitHub tenga el código)

1. Instalá Git desde https://git-scm.com/download/win
2. En Git Bash:

```bash
cd /c/Users/CP32/Documents
git clone https://github.com/gggaaarl/firox_codebar.git
cd firox_codebar
npm install
```

> Hoy GitHub está vacío. Primero hay que subir el código (ver TROUBLESHOOT-GIT.md).

---

## Si no ves `firox_codebar.zip` en Cursor

Decile al agente: "mostrame el zip" o refrescá la ventana del agente.
El archivo está en la raíz del proyecto del agente.
