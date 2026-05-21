# Sprint 2 — Vitrina pública `/casting`

**Branch:** `feat/casting-public-launch`
**Cierre:** 2026-05-21 (mismo día que Sprint 1)
**Tareas:** 2.0 (DB) → 2.1 (data layer) → 2.2 (index) → 2.3 ([slug]) → 2.4 (featured)

## Resumen ejecutivo

Yutro.cl ahora tiene una capa pública de Casting: lookbook editorial indexable, fichas individuales con schema.org y Open Graph, vista filtrada de Featured Talent, y stub del form de solicitud de acceso. El módulo privado `/studio/*` sigue intacto.

Lo que ve el visitante hoy:

| Ruta | Contenido |
|---|---|
| **`/casting`** | Lookbook editorial. Hero + 3 Featured (Camila, Antonia, Sofi) + 3 standard (Javiera Reyes, Patricio Soto, Sofía Lindberg) + CTA "Solicitar acceso". |
| **`/casting/featured`** | Filtrado al tier Featured. Destino del redirect desde `/influencer`. Empty state cuando no hay featured (no aplica todavía). |
| **`/casting/[slug]`** | Ficha pública 2-col: galería editorial + ficha tipográfica + bio + Instagram block (solo featured) + CTA. Schema.org Person + OG image dinámica. |
| **`/casting/solicitar-acceso`** | Stub editorial — `mailto:` provisorio mientras Sprint 3 construye el form real + backend. |

## DB migration aplicada

```sql
ALTER TABLE talents
  ADD COLUMN public_visible BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN tier TEXT DEFAULT 'standard' NOT NULL
    CHECK (tier IN ('standard', 'featured')),
  ADD COLUMN instagram_handle TEXT,
  ADD COLUMN instagram_followers INTEGER,
  ADD COLUMN public_bio_es TEXT,
  ADD COLUMN public_bio_en TEXT,
  ADD COLUMN public_slug TEXT;

CREATE UNIQUE INDEX talents_public_slug_unique
  ON talents (public_slug) WHERE public_slug IS NOT NULL;

CREATE INDEX talents_public_visible_idx
  ON talents (public_visible, tier) WHERE public_visible = TRUE;
```

- Aplicada via Supabase MCP el 2026-05-21 (migration `sprint2_talents_public_columns`).
- Replicada en repo en `drizzle/0007_talents_public_columns.sql`.
- Schema de Drizzle sincronizado en `src/db/schema.ts`.
- No-destructiva: todas las columnas nullable o con default. RLS deny-all se mantiene (no se agregó policy para anon read porque toda la lectura va via service_role server-side).

## Seed inicial (6 talentos públicos)

**Featured (3):** insertados como nuevas filas. Preservan a Camila, Antonia y Sofi del experimento original. Imágenes desde `/public/influencers/`. Cada uno con `instagram_followers`, `public_bio_*`, `public_slug` y `tier='featured'`.

| Code | Slug | Followers |
|---|---|---|
| YE-F01 | `camila` | 12,500 |
| YE-F02 | `antonia` | 8,200 |
| YE-F03 | `sofi` | 10,800 |

**Standard (3):** UPDATE sobre filas existentes del roster. Imágenes desde `/public/talents-webp/`.

| Code | Slug | Categoría |
|---|---|---|
| YE-W04 | `javiera-reyes` | Lifestyle |
| YE-M11 | `patricio-soto` | Familiar |
| YE-W25 | `sofia-lindberg` | Senior |

## Archivos modificados / creados / borrados

### Nuevos
- `src/lib/talents-public.ts` — data layer server-only
- `src/components/casting/FeaturedBadge.tsx`
- `src/components/casting/TalentCardPublic.tsx`
- `src/components/casting/CastingHero.tsx`
- `src/app/[locale]/casting/layout.tsx`
- `src/app/[locale]/casting/page.tsx`
- `src/app/[locale]/casting/[slug]/page.tsx`
- `src/app/[locale]/casting/featured/page.tsx`
- `src/app/[locale]/casting/solicitar-acceso/page.tsx` (stub)
- `drizzle/0007_talents_public_columns.sql`
- `.ai/changelog-sprint-2.md` (este archivo)

### Modificados
- `src/db/schema.ts` — talents table extended con 7 columnas
- `messages/es.json` + `messages/en.json` — namespace `casting`

### Borrados
- `src/data/influencers.ts` — los 3 personajes ya están en DB como Featured Talent. La data file orphan se elimina per DT-008 del backlog Sprint 1.

## Decisiones tomadas autónomamente (extender `.ai/decisions.md`)

| D-011 | RLS deny-all preservada, sin policy `anon read`. Razón: toda la lectura del catálogo público va via Server Components con service_role. Defense-in-depth: el data layer en `talents-public.ts` filtra explícitamente columnas que NUNCA exponen al cliente (`code`, internal status, etc.). |
|---|---|
| D-012 | Featured como nuevas filas (YE-F01/F02/F03), no como flag sobre roster existente. Razón: Camila/Antonia/Sofi son personajes NARRATIVOS distintos del roster profesional. El brief explícitamente dice "preservar los 3 personajes del experimento original". |
| D-013 | `resolvePublicImage` trata path-style (`/...`) como assets de `/public`. Los R2 keys quedan no-resueltos hasta que se implemente endpoint público. Hoy todos los 6 seedados tienen path-style, así que renderizan bien. Item nuevo en backlog. |
| D-014 | `/casting/solicitar-acceso` stub con `mailto:` en vez de form vacío. Razón: los CTAs de `/casting` y `/casting/featured` no pueden caer en 404. Sprint 3 lo reemplaza. |
| D-015 | Schema.org `Person` JSON-LD inline en la ficha. Razón: SEO enriquecido sin agregar un componente más. `nationality` hard-coded "Chile" porque todos los talentos del roster son LATAM con base CL. |

## Verificaciones

- `npx tsc --noEmit --skipLibCheck`: ✅ exit 0
- `messages/*.json`: ✅ JSON válido
- `/casting`, `/casting/featured`, `/casting/[slug]`, `/casting/solicitar-acceso`: ✅ rutas resuelven, server components renderizan, data llega
- `generateStaticParams` en `[slug]`: ✅ devuelve 6 slugs
- Tabla `talents`: 6 filas con `public_visible=true`, slugs únicos, tier correcto

## No hecho (intencional, fuera de Sprint 2)

- Form real `/casting/solicitar-acceso` + endpoint `POST /api/access-request` + tabla `access_requests` → Sprint 3
- Sitemap.xml rebuild completo con `/casting/[slug]` dinámicos → Sprint 4
- robots.txt → Sprint 4
- Endpoint público de imágenes para R2 keys → backlog (DT-009)
- Lighthouse, Open Graph validation tests → Sprint 4
- RLS policy explícita para anon read (defense-in-depth extra) → considerar en Sprint 4

## Issues / observaciones para revisión humana

1. **`tier` constraint en Drizzle**: la columna `tier` quedó como `text` en el schema de Drizzle, pero el CHECK en DB es `IN ('standard','featured')`. Drizzle no tiene una forma elegante de modelar PG check constraints más allá de raw SQL en la migration file. Si en el futuro alguien hace `db.update(...).set({ tier: 'foo' })` desde TS sin tipo enum, no le saltará error hasta DB. Sugerencia: agregar un type union en TS y validar en data layer.

2. **`@yutro_ia` en bios**: las bios originales de Camila/Antonia/Sofi mencionaban `@yutro_ia` (handle del estudio en IG). Yo limpié esas referencias en los `public_bio_*` para que las bios sean editoriales del talento, no del estudio. Si querés mantener la mención al @yutro_ia para reforzar autoría, agregalo manualmente en la DB.

3. **Subtitle del OG image**: la página `[slug]` pasa `&subtitle=` a `/api/og` pero el endpoint actual solo lee `title` y `locale`. Sub-óptimo pero no rompe. Si en Sprint 4 vale extender `/api/og` para soportar subtitle, podemos diferenciar las cards visuales de cada talento.

4. **Number en eyebrowProfile**: el "N°XX" en la ficha se calcula como `(slug.charCodeAt(0) + slug.length) % 100` — pseudo-aleatorio determinístico. Si querés números reales (N°01, N°02, etc.) tendrías que indexar los talentos públicos y pasarlo desde data layer. Funcional pero hacky.

5. **`/casting` no tiene marquee** (la home sí tiene SectionDivider con clientes). Si querés un marquee tipo "Disponible para Coca-Cola · Falabella · Carozzi" en /casting (con clientes ficticios o reales), avísame.

## Para Sprint 3

Lo que sigue: el form de acceso real (`access_requests` table + endpoint + email transaccional con Resend + UI). El stub actual sirve mientras tanto.
