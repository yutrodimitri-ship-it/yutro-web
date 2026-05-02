# Yutro Studio Talent — Módulo

Plataforma privada de licenciamiento de talento digital. Conceptualmente
"casa de talento digital" (modelo IMG/Elite/The Society) para personajes
100% sintéticos generados con IA y propios de Yutro.

**Estado actual:** Fase 1 (Mock). Todo el catálogo es estático en código.
**Cliente piloto:** Samsung (vía BBDO Chile), proyecto `samsung-galaxy-q1-2026`.

---

## Resumen del flujo

```
Login → Hub /studio
          ├── Mis Avatares       → /studio/dashboard         (existente, NO se toca)
          └── Catálogo Talent    → /studio/talent/[projectSlug]
                                    ├── (modal NDA primera vez)
                                    ├── (welcome splash primera vez)
                                    ├── Catálogo (filtros + grid)
                                    ├── Detalle (/talent/[code])
                                    └── Casting (/casting)
```

**Decisión clave:** la plataforma NUNCA genera contenido. Es un mostrario
estático. El admin sube los 30 talentos previamente; el cliente solo arma su
casting y confirma términos de licencia.

---

## Estructura de archivos

```
src/
├── types/
│   └── talent.ts                    Tipos del dominio (Talent, ProjectConfig, CastingState)
│
├── lib/talent/
│   ├── mock-data.ts                 30 talentos + 1 proyecto + helpers
│   ├── portrait-svg.ts              Generador SVG abstracto (placeholder Fase 1)
│   ├── casting-context.tsx          Context + reducer del shortlist (sessionStorage)
│   ├── talent-session-context.tsx   Provee userEmail + projectSlug a hooks
│   └── audit-log.ts                 Logger console (placeholder Fase 2 → DB)
│
├── components/studio/talent/
│   ├── StudioHubCard.tsx            Card del hub /studio
│   ├── TalentPlaceholder.tsx        Pantalla "Próximamente"
│   ├── Toast.tsx                    Toast custom + useToast hook
│   ├── Portrait.tsx                 Render del SVG con bloqueo click derecho/drag
│   ├── WatermarkOverlay.tsx         Filigrana diagonal sobre cada imagen
│   ├── ProjectHeader.tsx            Header del catálogo (server)
│   ├── ProjectStats.tsx             3 contadores X/N + link "Ver mi casting"
│   ├── FilterChips.tsx              13 chips (género/edad/categoría)
│   ├── TalentCard.tsx               Card 3:4 con todos los estados (Opción C)
│   ├── TalentGrid.tsx               Grid responsive + filtros + stagger
│   ├── TalentGallery.tsx            3 thumbs cuadrados estudio/lifestyle
│   ├── TalentDetail.tsx             Pantalla 3 completa (60/40 + spec grid)
│   ├── ExclusiveToggle.tsx          Switch custom 28x16 con spring
│   ├── SelectedItem.tsx             Item de la lista en /casting
│   ├── EmptyState.tsx               Borde dashed + CTA reusable
│   ├── LicenseTerms.tsx             Panel sticky read-only + submit
│   ├── CastingPageClient.tsx        Pantalla 4 wrapper client
│   ├── NdaModal.tsx                 Modal click-wrap del NDA
│   ├── NdaGate.tsx                  Gate que muestra el modal según sessionStorage
│   ├── WelcomeOverlay.tsx           Splash de bienvenida (3.5s + skip)
│   ├── WelcomeGate.tsx              Gate del welcome según sessionStorage
│   └── TalentSkeleton.tsx           Skeletons compartidos para loading.tsx
│
└── app/[locale]/studio/talent/
    ├── layout.tsx                   Guard de acceso al módulo (TALENT_CLIENT_EMAILS)
    ├── page.tsx                     Redirect al primer proyecto activo
    ├── [projectSlug]/
    │   ├── layout.tsx               TalentSessionProvider + CastingProvider + ToastProvider + NdaGate + WelcomeGate
    │   ├── loading.tsx              Catalog skeleton
    │   ├── error.tsx                Error boundary del proyecto
    │   ├── page.tsx                 Pantalla 2 catálogo
    │   ├── talent/[code]/
    │   │   ├── loading.tsx          Detail skeleton
    │   │   └── page.tsx             Pantalla 3 detalle
    │   └── casting/
    │       ├── loading.tsx          Casting skeleton
    │       └── page.tsx             Pantalla 4 casting
    └── README.md                    Este archivo
```

---

## Estados de datos

### Flujo en Fase 1 (mock)

```
mock-data.ts (30 talentos + Samsung)
   ↓
ProjectLayout (lee proyecto, monta CastingProvider)
   ↓
CastingProvider (state: shortlist + exclusives)
   ↓ (sessionStorage `casting:samsung-galaxy-q1-2026`)
   ↓
[ TalentCard | TalentDetail | SelectedItem | LicenseTerms ]
   useCasting() → state + actions
```

### Persistencia del state

| Storage Key | Contenido | Lifecycle |
|---|---|---|
| `casting:${projectSlug}` | shortlist + exclusives | Por sesión (no localStorage) |
| `nda:accepted:${projectSlug}` | ISO timestamp | Por sesión |
| `welcome:seen:${projectSlug}` | ISO timestamp | Por sesión |

Cerrar la pestaña preserva todo. Cerrar el navegador completo limpia todo
(comportamiento sessionStorage).

### Audit log (Fase 1: console)

Todos los eventos se loguean con prefix `[AUDIT]` en console:

| Evento | Disparador | Datos |
|---|---|---|
| `session_start` | layout server-side al cargar | client, projectName |
| `nda_accepted` | NdaGate al aceptar | — |
| `welcome_seen` | WelcomeGate al dismiss | — |
| `talent_viewed` | TalentDetail al mount | talentCode |
| `talent_added` | TalentCard / TalentDetail | talentCode, source |
| `talent_removed` | TalentCard / TalentDetail / CastingPageClient | talentCode, source |
| `exclusive_toggled` | CastingPageClient | talentCode, isExclusive |
| `casting_submitted` | LicenseTerms al confirm | talentCodes, exclusiveCodes, counts |

**Fase 2:** reemplazar el cuerpo de `logAuditEvent` por POST a
`/api/studio/talent/audit` que persiste en tabla `talent_access_logs`.

---

## Decisiones de diseño inamovibles

Heredadas del descubrimiento inicial. **NO cuestionar durante implementación.**

1. **State management:** React Context + useReducer (NO Zustand)
2. **Persistencia casting:** sessionStorage (NO localStorage)
3. **Tipografía:** Outfit + Plus Jakarta Sans (NO Fraunces, NO JetBrains Mono)
4. **Mono:** `ui-monospace` del sistema vía `font-mono` de Tailwind
5. **Color acento Talent:** dorado `oklch(0.78 0.08 75)` (#d9b478)
6. **Naranja `--primary`:** marca Yutro global, NO se usa en Talent
7. **i18n:** bilingüe ES + EN desde día 1 (`studio.talent.*`)
8. **Dark mode:** forzado, sin toggle
9. **Strangler Fig:** NO modificar login, dashboard, generate, history, admin
10. **Modelo de negocio:** catálogo estático, NO generación en runtime

---

## Cómo navegar el módulo

### Como cliente (BBDO/Samsung)

1. `https://www.yutro.cl/es/studio/login` → ingresa con `test@bbdo.cl`
2. Llega al hub `/studio` → ve 2 cards (Mis Avatares + Catálogo Talent)
3. Click en "Catálogo Talent" → modal NDA bloquea hasta aceptar
4. Después del NDA → splash de bienvenida (3.5s o skip)
5. Catálogo con 22 talentos curados → filtra y selecciona hasta 10
6. Click en card → detalle del talento con galerías
7. "Ver mi casting" → confirma exclusividades + acepta términos read-only
8. Submit → toast de confirmación + auditoría queda registrada

### Como dev de Yutro

```bash
npm run dev
# Login con test@bbdo.cl, milivoy@yutro.cl, o yutrodimitri@gmail.com
# (los emails con acceso están en TALENT_CLIENT_EMAILS de mock-data.ts)
```

Para ver eventos de auditoría: abre devtools console y busca `[AUDIT]`.

---

## Fase 1 vs Fase 2

### Lo que es mock en Fase 1 (este sprint)

- Los 30 talentos viven en `mock-data.ts`
- Las imágenes son SVG generados con math (head/shoulders abstracto)
- El audit log va a `console.log`
- El submit del casting solo dispara un toast — no envía email ni guarda en DB
- La verificación de acceso (`userHasTalentAccess`) es una lista hardcoded de emails
- El NDA aceptado vive en sessionStorage (se pierde al cerrar navegador)

### Lo que se conecta a backend en Fase 2

- Tablas Drizzle: `talents`, `projects`, `casting_submissions`, `talent_access_logs`, `nda_acceptances`
- `getProjectsForUser(email)` → query a `projects WHERE contact_email = ?`
- `userHasTalentAccess(email)` → mismo query con count > 0
- Imágenes: Cloudflare R2 + sharp para watermark dinámico server-side
  - API route `/api/studio/talent/image/[code]/[variant]` con auth + watermark + audit log
- `logAuditEvent` → POST a `/api/studio/talent/audit` con persistencia en DB
- Submit del casting → POST a `/api/studio/talent/castings` que crea registro y notifica a Milivoy via Resend
- Panel admin: CRUD de talentos, proyectos y bandeja de submissions

---

## Cómo agregar un talento (Fase 2)

> Placeholder — se completa cuando se construya el panel admin en Fase 2.

Flujo previsto:
1. Admin entra a `/studio/talent/admin/talents/new`
2. Sube 8 imágenes con estructura: `profile.jpg`, `charsheet.jpg`,
   `studio-1.jpg`, `studio-2.jpg`, `studio-3.jpg`, `lifestyle-1.jpg`,
   `lifestyle-2.jpg`, `lifestyle-3.jpg`
3. Llena metadatos (gender, ageRange, phenotype, archetype, category, etc.)
4. Sistema procesa imágenes con sharp (resize a 1200px max + comprime)
5. Sube a Cloudflare R2 bucket privado
6. Inserta registro en tabla `talents`

---

## Cómo crear un proyecto (Fase 2)

> Placeholder — Fase 2.

Flujo previsto:
1. Admin entra a `/studio/talent/admin/projects/new`
2. Configura: cliente, contacto email, fechas, market, exclusivityMode,
   maxTalents, maxExclusive, blockedTalentCodes
3. Sistema genera slug y guarda en tabla `projects` con status `pending`
4. Cliente recibe email de invitación con link al proyecto
5. Al primer login del cliente, status pasa a `active`
6. Cuando el cliente hace submit del casting, llega a la bandeja de Milivoy

---

## Compliance (Ley 19.628 Chile + LGPD)

- **NDA digital click-wrap:** registro per-sesión en sessionStorage en Fase 1, persistente en DB en Fase 2.
- **Watermarks legales:** cada imagen renderizada incluye `YUTRO ESTUDIO · {CLIENT} · {DATE} · {CODE}` diagonal.
- **Audit log:** trazabilidad completa de quién vio qué y cuándo.
- **No PII:** los talentos son 100% sintéticos, no derivados de personas reales identificables.
- **Imágenes vía API route en Fase 2:** ninguna URL pública directa al storage.
