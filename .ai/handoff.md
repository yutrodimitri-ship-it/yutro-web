# Handoff — feat/casting-public-launch

**Cierre:** 2026-05-21
**Branch:** `feat/casting-public-launch` ya pushed a GitHub
**PR sugerida:** `feat/casting-public-launch` → `master`
**Sprints completos:** 1, 2, 3, 4 (los 4 del brief original)

---

## TL;DR

El sitio público de yutro.cl ahora refleja el nuevo posicionamiento dual (producción + casting digital) y tiene una vitrina pública del Casting con lookbook editorial, ficha por talento, vista filtrada de Featured Talent y form de captura de leads con backend completo (DB + email admin + email lead + Slack opcional). El módulo privado `/studio/*` no fue tocado en ningún commit.

---

## Estado del checklist global (brief §7)

| Item | Estado |
|---|---|
| Menú nuevo sin "Influencer" ni "Studio" | ✅ |
| Home: hero nuevo + Casting destacado | ✅ |
| `/casting` lookbook con ≥6 talentos | ✅ (3 featured + 3 standard) |
| `/casting/[slug]` ficha completa con schema.org + OG | ✅ |
| `/casting/featured` filtrado | ✅ |
| `/casting/solicitar-acceso` form + email + DB | ✅ |
| `/influencer` 301 → `/casting/featured` | ✅ (next.config) |
| `/servicios` 301 → `/produccion` | ✅ (next.config) |
| `/estudio` accesible + SEO-indexable | ✅ |
| Footer copyright corregido | ✅ |
| sitemap.xml dinámico | ✅ |
| robots.txt bloquea `/studio/*` y `/api/*` | ✅ |
| Regresión auth = 0 (`/studio/*` intacto) | ✅ |
| Lighthouse `/casting`: Perf>85, SEO>95, A11y>90 | ⏳ Requiere preview deploy |
| `.ai/handoff.md` listo | ✅ (este archivo) |

**Cumple 14/15.** El único pendiente requiere deploy preview de Vercel para correr Lighthouse con datos representativos.

---

## Commits en la branch

```
docs(sprint-4): pending
feat(seo): sitemap + robots + og subtitle + cleanup (sprint 4)
docs(sprint-3): changelog + decisions D-016..D-019 + backlog DT-013..DT-016
feat(casting): access request form + endpoint + admin listing (sprint 3)
docs(sprint-2): changelog + decisions D-011..D-015 + backlog DT-009..DT-012
feat(casting): public lookbook routes + data layer (sprint 2.1-2.4)
feat(db): extend talents with public catalog columns + seed 6 (sprint 2.0)
docs(sprint-1): changelog + decisions + backlog
chore(cleanup): orphan StudioBanner + dead i18n + framer typing
fix(footer): corrected legal copyright + brand structure
feat(casting): remove /influencer routes with 301
feat(produccion): rename /servicios → /produccion with 301
feat(estudio): new /estudio manifesto page
feat(home): add CastingPreview section + reorder sections
feat(home): new hero copy + dual CTAs
feat(nav): refactor header menu to new positioning
```

---

## Antes/después clave

### Menú

| Antes | Después |
|---|---|
| Proyectos · Servicios · Influencer · Studio · Blog · Contacto | Casting · Producción · Estudio · Blog · Contacto · **[Acceso cliente]** (outlined coral) |

### Home

| Antes | Después |
|---|---|
| Hero "CREAMOS CON IA" · 1 CTA | Hero "Producción audiovisual con IA *y casting digital propio.*" · 2 CTAs |
| StudioBanner (banner coral con CTA al login) | **CastingPreview** (editorial con 3 cards + CTA público) |
| Banner arriba de Proyectos | Casting arriba de Proyectos |

### URLs

| Antes | Después |
|---|---|
| `/servicios` | `/produccion` (con 301) |
| `/influencer/*` | 301 → `/casting/featured` |
| (no existía) | `/estudio` (manifiesto) |
| (no existía) | `/casting`, `/casting/[slug]`, `/casting/featured`, `/casting/solicitar-acceso` |

### Footer copyright

```
- © 2026 YUTRO. Una marca de VRYP – Art & AI Solutions.
+ © 2026 Yutro · VRYP Art & AI Solutions · Santiago, Chile.
```

---

## Variables de entorno nuevas para Vercel

```bash
# Sprint 3 — Solicitudes de acceso (Casting)
ADMIN_NOTIFY_EMAIL=contacto@yutro.cl   # opcional, default = EMAIL_TO
SLACK_WEBHOOK_URL=                      # opcional, sin webhook = silencioso
```

Las existentes (`RESEND_API_KEY`, `EMAIL_FROM_*`, `EMAIL_TO`, `EMAIL_CC`, `DATABASE_URL`, `AUTH_SECRET`, etc.) NO cambian.

⚠️ **Para que los emails funcionen en producción**, `RESEND_API_KEY` debe ser una key real (no `re_xxx`) y el dominio `yutro.cl` debe estar verificado en Resend (DKIM + SPF). Sin esto el endpoint funciona igual (guarda el lead) pero loguea warning y no manda el email.

---

## Migraciones de Supabase aplicadas

Ya están en producción (aplicadas via MCP). Para deploys fresh de DB:

```
drizzle/0007_talents_public_columns.sql   # Sprint 2
drizzle/0008_access_requests.sql          # Sprint 3
```

**Seed de datos (no en migration, hecho via SQL directo)**:
- 3 talentos featured insertados: YE-F01 Camila, YE-F02 Antonia, YE-F03 Sofi
- 3 talentos standard flippeados a `public_visible=true`: YE-W04 Javiera Reyes, YE-M11 Patricio Soto, YE-W25 Sofía Lindberg

Si necesitás replicar en otra instancia de Supabase, el seed SQL está en el cuerpo del commit `feat(db): extend talents with public catalog columns + seed 6 (sprint 2.0)`.

---

## Cómo verificar en local

```powershell
git pull
git checkout feat/casting-public-launch
npm install
npm run dev
```

URLs para revisar:

```
http://localhost:3000/es                                    Home con CastingPreview
http://localhost:3000/es/casting                            Lookbook
http://localhost:3000/es/casting/camila                     Ficha featured
http://localhost:3000/es/casting/javiera-reyes              Ficha standard
http://localhost:3000/es/casting/featured                   Vista filtrada
http://localhost:3000/es/casting/solicitar-acceso           Form real
http://localhost:3000/es/estudio                            Manifiesto
http://localhost:3000/es/produccion                         (ex /servicios)
http://localhost:3000/es/servicios                          → 301 a /produccion
http://localhost:3000/es/influencer                         → 301 a /casting/featured
http://localhost:3000/es/studio/admin/access-requests       Admin (requiere login)
http://localhost:3000/sitemap.xml                           XML completo
http://localhost:3000/robots.txt                            Disallow rules
http://localhost:3000/api/og?title=Camila&subtitle=Editorial+it-girl&locale=es   OG image dinámica
```

En EN cambia `/es/` por `/en/`.

---

## Steps post-merge

1. **Apply migrations en producción**: ya aplicadas via Supabase MCP. Solo verificar que la tabla `access_requests` y las columnas nuevas de `talents` existen. (Quedaron desde Sprint 2/3.)
2. **Setear `RESEND_API_KEY` real** en Vercel si no estaba. Verificar dominio `yutro.cl` en Resend.
3. **(Opcional) Setear `SLACK_WEBHOOK_URL`** en Vercel para notificaciones de Slack.
4. **Promote deploy preview a producción** vía Vercel dashboard.
5. **Correr Lighthouse** contra la URL pública. Si algún score no llega al target, abrir hotfix branch.
6. **Smoke test del flujo end-to-end**: llenar form de acceso con email corporativo → recibir confirmación → ver el lead en `/studio/admin/access-requests`.

---

## Issues abiertos para iteración futura

Ver `.ai/backlog.md` completo. Resumen:

| Sprint | Item | Severidad | Sugerencia |
|---|---|---|---|
| 1 | DT-004 contactInfo.company.name unused | trivial | decidir si logo es data-driven |
| 1 | DT-005 CastingPreview placeholders | low | cambiar a real `<Image>` de DB |
| 1 | DT-007 CSP review para IG embeds | medium | revisar si se agrega IG embed real |
| 2 | DT-009 endpoint público de imágenes R2 | medium | aún no necesario (todos los seedados son `/public/`) |
| 2 | DT-010 Drizzle tier sin type union | low | agregar `$type<PublicTalentTier>()` |
| 2 | DT-012 N°XX en eyebrow pseudo-aleatorio | low | columna `public_order` en DB |
| 3 | DT-013 status edit UI en admin | medium | PATCH + select inline |
| 3 | DT-014 `contacted_at` para deduplicar follow-ups | medium | columna nueva + UI |
| 3 | DT-015 debounce en email check | trivial | `useDeferredValue` si lista crece |
| 3 | DT-016 maxDuration en endpoint | low | `export const maxDuration = 30` |
| 4 | DT-017 sin analytics | medium | instalar `@vercel/analytics` |

Ninguno es un blocker para el merge.

---

## Decisiones autónomas tomadas (19 totales)

Ver `.ai/decisions.md` para el detalle de cada una. Cada decisión es reversible con un cambio puntual:

- D-001..D-010 (Sprint 1): branch base, public_visible default, clientAccess separado, label Studio EN, color coral, redirects en config, influencers.ts diferido, heroCTA alias, contactInfo cleanup, equipo placeholder
- D-011..D-015 (Sprint 2): RLS sin anon policy, featured como filas nuevas YE-F##, resolvePublicImage solo path-style, solicitar-acceso stub, schema.org nationality Chile
- D-016..D-019 (Sprint 3): honeypot 200 fake, notifs no bloqueantes, rate-limit fail-open, admin listing solo read

---

## Si querés revertir algo específico

| Tema | Archivo + cambio |
|---|---|
| Label "Studio" en menú EN → "About" | `messages/en.json:nav.estudio` |
| Texto del manifesto de /estudio | `messages/es.json:estudio.manifesto.*` |
| Copy del email al lead | `src/lib/access-request/emails.ts:renderLeadHtml/Text` |
| Marketing decide otro slug para Camila/Antonia/Sofi | UPDATE talents SET public_slug=... WHERE code='YE-F##' |
| Quitar Sofi del Featured | UPDATE talents SET public_visible=false WHERE code='YE-F03' |
| Agregar nuevo talento al Casting standard | UPDATE talents SET public_visible=true, public_slug='nombre-apellido' WHERE code='YE-...' |

---

## PR description sugerida

> **feat: Casting público + nuevo posicionamiento yutro.cl**
>
> Fase 1 del lanzamiento del Casting digital. Refactor del sitio público (home, header, footer), nueva ruta `/casting` con lookbook editorial + fichas + form de captura de leads con email a admin/Slack. El módulo privado `/studio/*` no fue tocado.
>
> **Closes:** brief en `.ai/changelog-sprint-*.md`
>
> **Sprints:** 1 (cimientos), 2 (vitrina), 3 (form + backend), 4 (SEO + handoff)
>
> **Migrations a aplicar antes del merge:**
> Ya aplicadas via Supabase MCP. Las migrations están archivadas en `drizzle/0007` y `0008` por si hay que replicar en otro environment.
>
> **Env vars nuevas en Vercel:**
> - `ADMIN_NOTIFY_EMAIL` (opcional, default `contacto@yutro.cl`)
> - `SLACK_WEBHOOK_URL` (opcional)
>
> **Steps post-merge:**
> 1. Verificar `RESEND_API_KEY` real en Vercel
> 2. Promote a producción
> 3. Lighthouse score check en `/casting`
> 4. Smoke test del flujo /casting/solicitar-acceso
