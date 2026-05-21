# Backlog — deuda técnica + observaciones encontradas

Cosas detectadas durante Sprint 1 que NO están en el scope de esta fase. Cada entrada es accionable: archivo + línea + descripción + sugerencia.

---

## DT-001 · Componentes Hero alternativos no usados (?)

**Archivos:** `src/components/sections/Hero.tsx`, `src/components/sections/HeroScrollAnimation.tsx`

**Observación:** Ambos parecen alternativas del HeroVideo actualmente activo en home. Referencian `t("heroCTA")` (la key vieja que dejé como alias deprecated). No están importados en `app/[locale]/page.tsx`.

**Sugerencia:** Auditar dónde se importan, si en ningún lado, borrar en cleanup commit. Si están en una ruta tipo `/preview`, refactor con la convención nueva.

---

## DT-002 · `services` i18n namespace todavía existe

**Archivo:** `messages/{es,en}.json` → `services.title`, `services.learnMore`

**Observación:** El namespace `services` (no `home.servicesTitle`) sigue existiendo y posiblemente lo lee `/produccion/page.tsx`. Las strings dicen "Servicios" / "Services" pero el contexto del producto cambió a "Producción".

**Sugerencia:** Auditar `produccion/page.tsx`. Si lee `t("title")` del namespace `services`, renombrar el namespace a `production` o actualizar el string a "Producción" / "Production".

---

## DT-003 · `meta.servicesTitle` / `servicesDescription` en i18n

**Archivo:** `messages/{es,en}.json` → `meta.servicesTitle` / `meta.servicesDescription`

**Observación:** Las strings de meta para servicios siguen como "Servicios" / "Services" con descripción que menciona "influencers digitales y contenido generativo". Quedaron desincronizadas con el nuevo posicionamiento.

**Sugerencia:** Actualizar a "Producción" / "Production" y rewriting de descripción que no mencione influencers. Probablemente Sprint 2 o cleanup pre-release.

---

## DT-004 · `contactInfo.company.name` no usado activamente

**Archivo:** `src/data/contact.ts:13`

**Observación:** Cambié `company.name` de "YUTRO." a "Yutro" pero no encontré ningún lugar del código que lo lea. El logo del header usa hardcoded `YUTRO.` con el dot coloreado. Si en algún punto querés que el logo lea del data, hay que migrar el render.

**Sugerencia:** Decidir si el logo debe ser data-driven (permite cambiar globalmente) o queda como JSX hardcoded (más simple, menos flexible).

---

## DT-005 · Imágenes de placeholders en CastingPreview

**Archivo:** `src/components/sections/CastingPreview.tsx`

**Observación:** Los 3 "personajes" del home son gradientes CSS, no fotos. Espera Sprint 2 con `getFeaturedTalents()`.

**Sugerencia:** En Sprint 2 reemplazar el `<div>` con `<Image>` apuntando a `image_profile_key` del talento. Mantener el overlay editorial bottom-gradient.

---

## DT-006 · `next-intl` provider check para keys nuevas

**Observación:** Agregamos varios namespaces nuevos (`estudio`, `home.casting`) y removimos otros (`studio.banner`). No hay validación automática que detecte una key faltante en un locale vs otro.

**Sugerencia:** En Sprint 4 (cuando hagamos Lighthouse + checks finales) correr un diff de keys entre `es.json` y `en.json` y reportar discrepancias. Considera un script `scripts/check-i18n.ts`.

---

## DT-007 · `proxy.ts` y CSP

**Archivo:** `src/proxy.ts`

**Observación:** `next.config.ts` comenta "Security headers are applied dynamically (with CSP nonce) in src/proxy.ts." No revisé el CSP. Si Sprint 2 introduce iframes (Instagram embeds para Featured Talents), hay que whitelist `instagram.com` y similares.

**Sugerencia:** Antes de Sprint 2 Tarea 2.3 (donde el Instagram embed entra en `/casting/[slug]`), revisar el `connect-src` y `frame-src` del CSP en proxy.ts.

---

## DT-008 · `src/data/influencers.ts` borrado pendiente

**Archivo:** `src/data/influencers.ts`

**Observación:** Marcado `@deprecated`. Quedará huérfano una vez que el seed de Featured Talents esté aplicado en DB.

**Sugerencia:** Después de Sprint 2 Tarea 2.1, borrar este archivo en commit `chore(cleanup): drop legacy influencers data file`. Asegurarse antes que el seed fue exitoso.

---

## DT-009 · Endpoint público de imágenes para R2 keys (Sprint 2)

**Archivo:** `src/lib/talents-public.ts:resolvePublicImage`

**Observación:** Hoy `resolvePublicImage` solo resuelve paths que empiezan con `/` (assets de `/public/`) o `http`. Los talentos con `image_profile_key` estilo R2 storage (sin slash inicial) retornan null y caen al placeholder gradient.

Los 6 talentos seedados en Sprint 2 tienen path-style (`/talents-webp/YE-W04/profile.webp`, `/influencers/Camila/avatar.webp`) así que renderizan bien. El problema aparecerá cuando se agreguen talentos nuevos con R2 keys plain.

**Sugerencia:** Crear endpoint `GET /api/casting/image/[slug]/[variant]` (sin auth) que:
1. Lee del talents por slug + variant (profile/charsheet/gallery-N)
2. Genera presigned URL de R2 con caché corta
3. Retorna 302 a la URL firmada (o sirve el bytes directo con Cache-Control: public, max-age=86400)

Reusar lógica del endpoint privado `/api/studio/talent/image/[code]/[variant]/route.ts` pero sin chequeo de session.

---

## DT-010 · Drizzle `tier` no tiene type union (Sprint 2)

**Archivo:** `src/db/schema.ts:tier`

**Observación:** `tier: text("tier").notNull().default("standard")` — Drizzle no modela el CHECK constraint. Si código TS hace `db.update(...).set({ tier: "foo" })` no salta error en compile, solo en runtime.

**Sugerencia:** En `src/lib/talents-public.ts` ya existe `export type PublicTalentTier = "featured" | "standard"`. Refactor `schema.ts` para usar Drizzle's `enum` type o agregar `$type<PublicTalentTier>()` al campo.

---

## DT-011 · `/api/og` no acepta `subtitle` (Sprint 2)

**Archivo:** `src/app/api/og/route.tsx`

**Observación:** La ficha pública `/casting/[slug]` pasa `&subtitle=` al endpoint pero el endpoint actual solo lee `title` y `locale`. La OG image de cada talento queda con el subtitle hardcoded "Productora Audiovisual con IA" en vez del archetype del talento.

**Sugerencia:** Extender `/api/og` para aceptar `subtitle` opcional. Si está, override del default. Permite que cada talento tenga su OG image personalizado con su archetype.

---

## DT-012 · `eyebrowProfile` N°XX en ficha es pseudo-aleatorio (Sprint 2)

**Archivo:** `src/app/[locale]/casting/[slug]/page.tsx`

**Observación:** El "N°XX" del eyebrow se calcula como `(slug.charCodeAt(0) + slug.length) % 100`. Determinístico pero hacky.

**Sugerencia:** Agregar columna `public_order INTEGER` en talents y rellenar manualmente (1, 2, 3, ...). El order también puede servir como tie-breaker en `getPublicTalents()`.
