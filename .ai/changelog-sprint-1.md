# Sprint 1 — Cimientos del nuevo posicionamiento

**Branch:** `feat/casting-public-launch`
**Cierre:** 2026-05-21
**Tareas:** 1.1 → 1.7 + cleanup

## Resumen ejecutivo

El sitio público de yutro.cl ahora refleja el nuevo posicionamiento dual (producción + casting digital). El módulo privado `/studio/*` no fue tocado — regresión auth = 0.

Cambios clave para el visitante:

- **Hero** rebrandeado: "Producción audiovisual con IA y casting digital propio."
- **Menú** rediseñado: Casting · Producción · Estudio · Blog · Contacto + botón "Acceso cliente" (outlined coral) a la derecha.
- **Home** reordenada: Hero → El Casting (nuevo, editorial) → Proyectos → Producción → Marquee → CTA.
- **Nueva ruta `/estudio`** con manifiesto del estudio, las dos líneas y placeholder de equipo.
- **`/servicios` → `/produccion`** con redirect 301 server-side. Internal links + sitemap actualizados.
- **`/influencer` borrado** con redirect 301 a `/casting/featured`. Los 3 personajes originales se preservan en `src/data/influencers.ts` como referencia para el seed de Featured Talents (Sprint 2).
- **Footer** con redacción legal corregida: `© 2026 Yutro · VRYP Art & AI Solutions · Santiago, Chile.`

## Commits (en orden)

| Hash | Tarea | Scope |
|---|---|---|
| f8a3a41 | 1.1 | `feat(nav)`: refactor header menu to new positioning |
| 954fe4c | 1.2 | `feat(home)`: new hero copy + dual CTAs |
| 18ccda3 | 1.3 | `feat(home)`: add CastingPreview section + reorder sections |
| (commit) | 1.4 | `feat(estudio)`: new /estudio manifesto page |
| (commit) | 1.5 | `feat(produccion)`: rename /servicios → /produccion with 301 |
| (commit) | 1.6 | `feat(casting)`: remove /influencer routes with 301 to /casting/featured |
| cb46757 | 1.7 | `fix(footer)`: corrected legal copyright + brand structure |
| 7120b74 | cleanup | `chore(cleanup)`: orphan StudioBanner + dead i18n + framer-motion typing |

## Archivos modificados / creados / borrados

### Nuevos
- `src/app/[locale]/estudio/layout.tsx`
- `src/app/[locale]/estudio/page.tsx`
- `src/components/sections/CastingPreview.tsx`
- `.ai/changelog-sprint-1.md` (este archivo)
- `.ai/decisions.md`
- `.ai/backlog.md`

### Modificados
- `src/data/navigation.ts` — nuevo menú + `clientAccessItem`
- `src/components/layout/Header.tsx` — desktop layout con botón outlined
- `src/components/layout/MobileNav.tsx` — drawer con botón al final
- `src/components/sections/HeroVideo.tsx` — nuevo copy + dual CTA + framer-motion staggered
- `src/components/sections/ServicesPreview.tsx` — refs /servicios → /produccion + section id
- `src/app/[locale]/page.tsx` — reorder + import CastingPreview
- `src/app/sitemap.ts` — quitar influencer entries + swap /servicios → /produccion
- `src/app/api/revalidate/route.ts` — path map actualizado
- `src/components/layout/Footer.tsx` — sin cambios estructurales, hereda contactInfo nuevo
- `src/data/contact.ts` — `company.name` y `company.parent` corregidos
- `next.config.ts` — redirects 301 para /servicios y /influencer
- `messages/es.json` + `messages/en.json` — nuevos namespaces `estudio` + `home.casting`, copyright actualizado, keys deprecated quitadas

### Borrados
- `src/app/[locale]/influencer/page.tsx`
- `src/app/[locale]/influencer/layout.tsx`
- `src/app/[locale]/influencer/[slug]/page.tsx`
- `src/app/[locale]/influencer/[slug]/InfluencerDetail.tsx`
- `src/components/sections/StudioBanner.tsx`

### Renombrados (git mv)
- `src/app/[locale]/servicios/{layout,page}.tsx` → `src/app/[locale]/produccion/{layout,page}.tsx`

## Verificaciones

- `npx tsc --noEmit --skipLibCheck`: ✅ exit 0
- `node` validation of `messages/es.json` y `messages/en.json`: ✅ JSON válido
- Smoke check de referencias huérfanas a `/servicios` y `/influencer` en `src/`: ✅ ninguna
- Tabla `talents`: no se tocó (Sprint 2 la extiende, Sprint 1 no la toca)
- `/studio/*` routes: no se tocaron

## No hecho (intencional, fuera de scope Sprint 1)

- DB migration (`public_visible`, `tier`, `instagram_handle`, etc.) → Sprint 2
- Componentes y data del módulo Casting público → Sprint 2
- Form `/casting/solicitar-acceso` + backend → Sprint 3
- Sitemap rebuild completo + robots → Sprint 4
- Borrado de `src/data/influencers.ts` → cleanup en Sprint 2 una vez seedeado en DB
- Reset del copy de manifesto y team de `/estudio` → marketing entrega copy final

## Issues abiertos / decisiones que pueden necesitar revisión

1. **Label "Studio" en EN del menú**: el menú EN tiene "Studio" como label de `/estudio`. El brief dijo que "Studio" como palabra sola no debe aparecer en el menú principal. Interpreté que se refería al concepto de plataforma privada, no al sustantivo (creative studio). Si quieres cambiar el label EN, alternativas: "The Studio", "About", "Inside". Cambio de 1 línea en `messages/en.json`.
2. **`heroCTA` key dejada como alias deprecated**: `Hero.tsx` y `HeroScrollAnimation.tsx` (componentes legacy aparentemente no usados en home) la siguen referenciando. No los borré porque podrían usarse en otra página. Vale la pena auditar si son orphans en Sprint 2 o más adelante.
3. **`/produccion` mantiene el copy y assets de `/servicios`**: el rename fue solo URL + título. El contenido interno sigue mencionando "servicios". Marketing puede iterar el copy sin tocar código.
4. **`/estudio` copy es first-draft**: tres párrafos de manifesto + cards de las dos líneas + placeholder de equipo. Esperamos copy final de marketing en una iteración separada.

## Para revisión humana antes de Sprint 2

- Confirmar el label "Studio" en EN.
- Validar el copy de hero, CastingPreview eyebrow ("Casting · Vol. 01 · 2026") y manifesto de /estudio.
- Confirmar que el founder es "Milivoy Dimitrijevic" en el placeholder de equipo (lo asumí del email `milivoy@yutro.cl` visto en `src/lib/talent/email.ts`). Si está mal, fix de 1 línea.
