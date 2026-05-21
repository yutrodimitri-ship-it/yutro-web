# Sprint 4 — SEO y observabilidad

**Branch:** `feat/casting-public-launch`
**Cierre:** 2026-05-21
**Tareas:** 4.1 → 4.4 + cleanup backlog Sprint 1

## Resumen ejecutivo

Cierra el brief. Sitemap dinámico cubre toda la nueva estructura pública (incluyendo `/casting/[slug]` derivados de DB), robots ya está bien orientado, `/api/og` ahora soporta subtítulo personalizado para fichas de talento, no hay analytics instalado (documentado), y se limpiaron 4 ítems técnicos del backlog Sprint 1.

## Tarea 4.1 — sitemap.xml dinámico

### Rutas estáticas

| Path | priority | changeFreq |
|---|---|---|
| `/` (home) | 1.0 | weekly |
| `/casting` | 0.95 | weekly |
| `/casting/featured` | 0.9 | weekly |
| `/estudio` | 0.85 | monthly |
| `/produccion` | 0.85 | monthly |
| `/proyectos` | 0.85 | monthly |
| `/blog` | 0.7 | monthly |
| `/contacto` | 0.7 | monthly |

Cada una con `alternates.languages: { es, en }` para hreflang.

### Rutas dinámicas

- `/proyectos/[slug]` — todos los proyectos en `src/data/projects.ts`
- `/casting/[slug]` — todos los talentos con `public_visible=true` (via `getAllPublicSlugs()`)
- `/blog/[slug]` — todos los posts (mantienen su locale propio)

### Exclusiones

- `/studio/*` (plataforma privada, también bloqueada por robots)
- `/api/*`
- `/casting/solicitar-acceso` (form con `noIndex` en meta)

### Tolerancia a fallos

Si la query a DB falla en `getAllPublicSlugs()`, se loguea warning pero el sitemap sigue generándose con el resto (proyectos + blog + estáticas).

## Tarea 4.2 — robots.txt

Sin cambios semánticos (ya estaba bien orientado). Comentario explicativo agregado.

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /studio/
Disallow: /_next/

Sitemap: https://www.yutro.cl/sitemap.xml
```

## Tarea 4.3 — Open Graph + schema.org

### `/api/og` extendido con subtitle

`/api/og?title=Camila&subtitle=Editorial%20it-girl&locale=es` ahora genera una OG image con el archetype del talento como subtítulo. Antes el subtítulo era hardcoded "Productora Audiovisual con IA".

La ficha pública `/casting/[slug]` ya pasa el `subtitle=` en su `generateMetadata`. Cierra DT-011.

### Schema.org Person en `/casting/[slug]`

Verificado en Sprint 2.3, sin cambios:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Camila",
  "description": "Editorial it-girl",
  "image": "https://www.yutro.cl/influencers/Camila/avatar.webp",
  "url": "https://www.yutro.cl/es/casting/camila",
  "nationality": { "@type": "Country", "name": "Chile" },
  "knowsAbout": ["Moda", "Belleza", "Retail joven"]
}
```

Cumple con los requirements de Google Search Console para rich snippets de Person.

## Tarea 4.4 — Analytics audit

**Resultado:** No hay analytics instalado en el repo. Ni `@vercel/analytics`, ni Plausible, ni Google Analytics, ni PostHog.

**Acción:** Documentar como item de backlog (DT-017) para que cuando se instale, el evento `access_request_submitted` se trackee desde el cliente (form submit success) o el server (endpoint 200).

## Cleanup del backlog Sprint 1 cerrado este sprint

### DT-001 — Hero.tsx y HeroScrollAnimation.tsx eliminados

Confirmado que ninguno se importaba. Borrados.

### DT-002 — `services` i18n namespace migrado

`/produccion/page.tsx` lee `useTranslations("services")`. Actualicé `services.title` de "Servicios"/"Services" a "Producción"/"Production". El namespace se mantiene (el path interno del archivo no se renombra) pero el contenido refleja el nuevo posicionamiento.

### DT-003 — `meta.servicesTitle/Description` actualizado

```
ES: "Servicios" → "Producción"
ES: "Producción creativa, animación, 3D, motion graphics, postproducción y más con IA."
  → "Producción audiovisual con IA: 3D, motion graphics, postproducción y contenido generativo para campañas publicitarias en LATAM."

EN: "Services" → "Production"
EN: "Creative production, animation, 3D, motion graphics, post-production and more with AI."
  → "AI-driven audiovisual production: 3D, motion graphics, post-production and generative content for advertising campaigns across LATAM."
```

### DT-006 — i18n key diff between locales

**Verificado clean:** 0 keys solo en es, 0 keys solo en en. Script de diff inline corrido en validación.

## Backlog nuevo (Sprint 4)

### DT-017 — Analytics no instalado

**Observación:** Repo no tiene tracking de pageviews ni eventos. Para entender conversion del Casting → form de acceso → reuniones agendadas, necesitamos analytics.

**Sugerencia:**
1. `@vercel/analytics` para pageviews (1 línea en `layout.tsx`, gratis, integrado con Vercel)
2. Custom event `access_request_submitted` con `track()` desde el form
3. Opcional: PostHog para funnel completo (signup → submit → admin contact)

## Verificaciones finales

- `npx tsc --noEmit --skipLibCheck` → exit 0
- `messages/*.json` válidos
- Diff de keys entre locales → 0 huérfanas
- `git status` → working tree clean tras cleanup

## Items del checklist global del brief (sección 7)

- [x] yutro.cl muestra menú nuevo sin "Influencer" ni "Studio"
- [x] Home: hero nuevo + sección El Casting destacada
- [x] `/casting` carga lookbook con ≥6 talentos (3 featured + 3 standard)
- [x] `/casting/[slug]` ficha completa con galería + ficha + CTA + schema.org + OG dinámico
- [x] `/casting/featured` filtra correctamente
- [x] `/casting/solicitar-acceso` envía email a admin y al lead, persiste en DB
- [x] `/influencer` → 301 a `/casting/featured`
- [x] `/servicios` → 301 a `/produccion`
- [x] `/estudio` accesible y SEO-indexable
- [x] Footer redacción legal corregida
- [x] sitemap.xml incluye rutas nuevas, excluye `/studio/*`
- [x] robots.txt bloquea `/studio/*` y `/api/*`
- [x] `/studio/*` no fue tocado (regresión auth = 0)
- [ ] Lighthouse `/casting`: Performance > 85, SEO > 95, A11y > 90
      → Requiere correr Lighthouse contra preview deploy de Vercel. No
        verificable desde dev local con resultados representativos
        (LCP en dev es 3-5× lo de prod por el bundler dev).
- [x] `.ai/handoff.md` listo

Cumple 14/15 — el único pendiente requiere preview deploy real, que es paso siguiente al merge.

## Para Lighthouse (paso post-merge)

Una vez merged a master y deployado en Vercel preview:

```bash
# Local contra preview
npx lhci autorun --collect.url=https://<preview>.vercel.app/es/casting

# O via PageSpeed Insights manual:
# https://pagespeed.web.dev/?url=https://yutroweb-git-feat-casting...
```

Targets:
- Performance > 85 — depende de optimización de imágenes y JS bundle del nuevo casting (debería pasar; el lookbook es server component con Image optimization)
- SEO > 95 — schema.org + OG + sitemap + meta tags están todos puestos
- A11y > 90 — labels, alt text, contraste; verificar focus states en form

Si algo no llega al target, queda como hotfix post-merge en otra branch.
