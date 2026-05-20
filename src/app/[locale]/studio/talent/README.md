# Yutro Studio Talent — Módulo

Plataforma privada de licenciamiento de talento digital sintético. Los
talentos son personajes 100% generados con IA y propiedad de Yutro; el
cliente arma su casting, marca exclusividades y firma términos de licencia.

**Estado:** Fase 3 (producción). El módulo es la única superficie de
`/studio` — el pipeline de generación de avatares fue retirado.

---

## Flujo de usuario

```
/studio (redirect según rol)
  ├── admin  → /studio/talent/admin
  └── client → /studio/talent
                └── (sin proyecto) → /studio/talent (mensaje sin acceso)
                └── (con proyecto) → /studio/talent/[projectSlug]
                                      ├── NDA gate (primera vez por sesión)
                                      ├── Catálogo + filtros
                                      ├── Detalle del talento (/talent/[code])
                                      └── Confirmación de casting (/casting)
```

Acceso por proyecto se controla en `talent_project_access` (granted/revoked
por admin). Un usuario puede tener acceso a múltiples proyectos.

---

## Estructura de archivos

```
src/
├── types/talent.ts                     Tipos del dominio
│
├── lib/talent/
│   ├── data-source.ts                  Reads/writes de DB (drizzle)
│   ├── mock-data.ts                    Fallback dev sin DB (no usado en prod)
│   ├── admin-schemas.ts                Zod schemas + enums (categorías, industrias)
│   ├── audit-log.ts (client)
│   ├── audit-log-server.ts             Persiste a talent_access_logs
│   ├── casting-context.tsx             Reducer + sessionStorage del shortlist
│   ├── talent-session-context.tsx
│   ├── image-variants.ts               Resolver de /talents-webp paths
│   ├── portrait-svg.ts                 Placeholder SVG si falta la imagen
│   └── email.ts                        Resend wrapper para casting confirmations
│
├── components/studio/talent/
│   │   (vista cliente)
│   ├── CastingPageClient.tsx
│   ├── ConfirmSubmitModal.tsx
│   ├── EmptyState.tsx
│   ├── ExclusiveToggle.tsx
│   ├── FilterChips.tsx                 11 chips (género/edad/categoría)
│   ├── LandingCovers.tsx               Hero del proyecto en /studio/talent
│   ├── LicenseTerms.tsx
│   ├── NdaGate.tsx + NdaModal.tsx
│   ├── Portrait.tsx                    Card con bloqueo de click derecho/drag
│   ├── ProjectHeader.tsx
│   ├── ProjectStats.tsx
│   ├── SelectedItem.tsx
│   ├── TalentCard.tsx
│   ├── TalentDetail.tsx                Pantalla 3 con bio, editorial score, etc.
│   ├── TalentGallery.tsx               Comp Card / Lifestyle / Editorial tabs
│   ├── TalentGrid.tsx
│   ├── TalentImage.tsx
│   ├── TalentSkeleton.tsx
│   ├── Toast.tsx
│   │
│   └── admin/                          (vista admin)
│       ├── AdminTable.tsx
│       ├── BulkUpload.tsx
│       ├── DeleteProjectButton.tsx
│       ├── DeleteTalentButton.tsx
│       ├── LocksTable.tsx              Comprometidos cross-project
│       ├── ProjectAccessManager.tsx    Grant/revoke acceso por email
│       ├── ProjectForm.tsx
│       ├── ProjectNdaManager.tsx
│       ├── ProjectSubmissionsPanel.tsx
│       └── TalentForm.tsx
│
└── app/[locale]/studio/talent/
    ├── layout.tsx                      Guard: client/admin con acceso al módulo
    ├── page.tsx                        Sin proyecto → mensaje · Con proyecto → redirect
    ├── [projectSlug]/
    │   ├── layout.tsx                  TalentSessionProvider + CastingProvider + NdaGate
    │   ├── page.tsx                    Landing del proyecto (LandingCovers)
    │   ├── catalog/page.tsx            Catálogo filtrado
    │   ├── talent/[code]/page.tsx      Detalle
    │   └── casting/page.tsx            Confirmación
    └── admin/
        ├── page.tsx                    Hub admin
        ├── locks/page.tsx              Tabla de bloqueos cruzados
        ├── projects/{[slug],new,page}
        ├── submissions/{[id],page}
        └── talents/{[code],[code]/upload,new,page}
```

---

## Modelo de datos

Tablas Postgres (drizzle):

| Tabla | Propósito |
|---|---|
| `talents` | Roster curado. Incluye bio_{es,en}, editorial_score (0-5), category, gender, ageRange, phenotype, archetype, market, suggestedUses, hue/sat para el placeholder |
| `talent_projects` | Briefs activos. Una sola industria (`category_es`), maxTalents, maxExclusive, rightsDurationMonths, startDate, status |
| `talent_project_access` | Quién puede ver qué proyecto (email + projectSlug + grantedBy/grantedAt + revokedAt) |
| `nda_acceptances` | NDA firmado por email × proyecto |
| `casting_submissions` | Casting confirmado por un cliente |
| `talent_access_logs` | Audit trail completo (todos los eventos de la app) |

Migraciones SQL en [drizzle/](../../../../../drizzle/) — ver
[drizzle/README.md](../../../../../drizzle/README.md) para el flujo manual de aplicación.

---

## Persistencia client-side

| Storage key | Contenido | Lifecycle |
|---|---|---|
| `casting:${projectSlug}` | shortlist + exclusivos | sessionStorage |
| `nda:accepted:${projectSlug}` | timestamp ISO | sessionStorage (se replica a DB al confirmar casting) |

Cerrar pestaña preserva. Cerrar navegador limpia.

---

## Audit log

Persistido en `talent_access_logs` vía `logAuditEventServer()`. Eventos:

| Evento | Disparador |
|---|---|
| `session_start` | Layout server-side |
| `nda_accepted` | NdaModal submit |
| `talent_viewed` | TalentDetail mount |
| `talent_added` / `talent_removed` | TalentCard / TalentDetail |
| `exclusive_toggled` | CastingPageClient |
| `casting_submitted` | LicenseTerms |
| `admin_access_granted` / `admin_access_revoked` | ProjectAccessManager / users page |
| `talent_lock_released` | release-talent route |

---

## Decisiones inamovibles

1. **State management:** Context + useReducer (no Zustand).
2. **Persistencia casting:** sessionStorage, no localStorage.
3. **Imágenes:** WebP en `/public/talents-webp/{code}/`. PNG masters quedan local + R2 backup, gitignorados.
4. **Watermarks:** runtime via sharp en `/api/studio/talent/image/[code]/[variant]` (auth-gated). Nunca URL pública directa.
5. **i18n:** bilingüe ES/EN desde el día 1 (`studio.talent.*`).
6. **Surface:** cream paper editorial (light theme propio del módulo), accent naranja YUTRO (oklch 0.68 0.21 42).
7. **Tipografía Talent:** Archivo 800 display + JetBrains Mono 500 caps.
8. **Modelo de negocio:** catálogo estático curado, sin generación en runtime.

---

## Tests

```bash
npm test
```

Cobertura actual:
- `src/lib/talent/__tests__/casting-reducer.test.ts`
- `src/lib/talent/__tests__/idempotency.test.ts`

Pendiente (Fase 4):
- Tests de `locks-reducer` y `release-talent` route
- E2E Playwright del flujo casting → submission → admin lock release
