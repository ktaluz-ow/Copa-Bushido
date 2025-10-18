# Copa Bushido (estático)

Este proyecto respeta **tal cual** tu diseño de Canva usando cada página como **imagen de fondo** (PNG), y encima coloca zonas transparentes (hotspots) e inputs invisibles para que todo funcione sin cambiar el estilo.

## Estructura
- `index.html` (Home)
- `sorteo.html` (controlador) y `sorteo_view.html` (emergente)
- `kumite.html` (controlador) y `kumite_view.html` (emergente)
- `kata.html`
- `assets/` — poné acá tus PNGs exportados de Canva con los nombres exactos:
  - `01-home.png`
  - `02-sorteo.png`
  - `03-sorteo-emergente.png`
  - `04-kumite.png`
  - `05-kumite-emergente.png`
  - `06-kata.png`

> Tip: Presioná **D** para activar el **modo debug** y ver los contornos de los hotspots/inputs. Así podés ajustar posiciones en `css/styles.css` (variables `--*`).

## Sorteo
- Escribí los nombres en las líneas **ANOTAR…** (inputs invisibles arriba del área de lista).
- **ETIQUETA**: activa el modo etiquetas. Clic en un participante o presioná:
  - **M** → etiqueta **M**
  - **J** → etiqueta **J**
  - **X** → sin etiqueta
- **GIRAR**: hace el sorteo priorizando cruces **M–J**. Soporta N impar (BYE).
- **PANT. EMERGENTE**: abre la vista limpia para proyectar (con animación al mezclar).

## Kumite
- **Fin inmediata por ippon** (toggle).
- **Puntos para ganar**: **ilimitado**, entero ≥ 1 (se edita haciendo clic en el área del botón y escribiendo en el prompt).
- **Tiempo**: Iniciar/Reiniciar/Reset, rápidos 2’ y 5’, o tiempo a elección (1–10’).
- **Puntuación**: waza-ari **0,5**, ippon **1,0**; penalizaciones ±; **DQ** a las 3.
- **Sin sonido**; al finalizar el tiempo hay **flash visual**.

## Publicar en GitHub Pages
1. **Crea el repo** en GitHub (por ejemplo, `copa-bushido`).
2. Subí **todo el contenido** de esta carpeta (incluido `assets/`).
3. En GitHub, entrá a **Settings → Pages**.
   - En **Source**, elegí `Deploy from a branch`.
   - Branch: `main` (o `master`) – Folder: `/ (root)`.
   - Guardá. Esperá a que aparezca la URL de tu sitio `https://tu-usuario.github.io/copa-bushido/`.
4. Probá: `https://tu-usuario.github.io/copa-bushido/` → debería cargar `index.html`.

## Ajustar posiciones (si hace falta)
- Abrí `css/styles.css` y buscá las variables `--home-*`, `--sorteo-*`, `--kumite-*`.
- Entrá al sitio y presioná **D** para activar los contornos. Ajustá `left/top/width/height` (en %) hasta que los hotspots calcen **exacto** sobre tus botones/textos.
- No cambia el diseño visual; solo estamos alineando las zonas clicables.

¡Éxitos!
