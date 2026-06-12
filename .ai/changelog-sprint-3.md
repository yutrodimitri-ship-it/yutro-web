# Sprint 3 — Form de acceso + backend + notificación

**Branch:** `feat/casting-public-launch`
**Cierre:** 2026-05-21
**Tareas:** 3.0 (DB) → 3.1 (form) → 3.2 (endpoint) → 3.3 (admin opcional, hecho)

## Resumen ejecutivo

La capa pública de Casting ahora tiene un flujo real de captura de leads: form completo en `/casting/solicitar-acceso` → endpoint con rate-limit + email a admin + email de confirmación + Slack opcional → admin puede ver los leads en `/studio/admin/access-requests`.

## DB migration aplicada

```sql
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  country TEXT,
  project_type TEXT,
  timeline TEXT,
  budget_range TEXT,
  attribution TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'qualified', 'disqualified', 'converted')),
  ip_address TEXT,
  user_agent TEXT,
  locale TEXT NOT NULL DEFAULT 'es'
);
CREATE INDEX idx_access_requests_status ON access_requests(status);
CREATE INDEX idx_access_requests_created ON access_requests(created_at DESC);
CREATE INDEX idx_access_requests_ip_recent ON access_requests(ip_address, created_at DESC);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
-- Sin policies — deny-all por default. Service role bypass.
```

- Aplicada via Supabase MCP (`sprint3_access_requests`)
- Mirror en `drizzle/0008_access_requests.sql`
- Drizzle schema agregado en `src/db/schema.ts`

## Form `/casting/solicitar-acceso`

10 campos:
1. Nombre completo *
2. Email corporativo * (bloquea @gmail/hotmail/yahoo/outlook/icloud + variantes regionales)
3. Empresa *
4. Rol *
5. País * (11 opciones, default CL)
6. Tipo de proyecto * (5 opciones)
7. Plazo * (3 opciones)
8. Rango de presupuesto USD * (5 opciones)
9. ¿Cómo nos conociste? * (6 opciones)
10. Notas (textarea, max 500, opcional)

Extras:
- **Honeypot** `<input name="website">` escondido fuera de viewport
- **Rate limit cliente**: 1 submit/minuto via localStorage timestamp
- **Validación inline**: el campo email muestra error apenas se escribe un dominio bloqueado
- **UX post-submit**: panel editorial "Solicitud recibida" + link de vuelta al Casting

Layout 2-col en desktop (copy + steps | form), 1-col en mobile.

## Endpoint `POST /api/access-request`

Pipeline:
1. Parse JSON body, validate con Zod (mismo schema que el form)
2. Si honeypot lleno → 200 OK fake (no guarda)
3. Capturar IP (`x-forwarded-for` o `x-real-ip`) + user-agent
4. Rate limit por IP: 3 req / 1h → 429 (fail-open si el query falla)
5. INSERT en `access_requests`
6. Promise.allSettled de:
   - Email admin via Resend (subject `[Yutro Casting] Nueva solicitud — Empresa · Tipo`)
   - Email confirmación al lead (ES/EN)
   - Slack webhook opcional
7. Response 200 `{ok:true, id}` antes de que las notificaciones terminen (Vercel Fluid las mantiene en pipeline)

Códigos:
- `200 {ok:true, id}` éxito
- `400 {ok:false, error:"validation", details:[]}` parse error
- `400 {ok:false, error:"invalid_body"}` JSON malformado
- `429 {ok:false, error:"rate_limit"}`
- `500 {ok:false, error:"server"}` DB error

## Email templates (Resend)

Ambos editorial, sin assets externos, HTML inline + text fallback.

**Admin:**
- Subject: `[Yutro Casting] Nueva solicitud — {Empresa} · {Tipo de proyecto}`
- Body: tabla compacta con todos los campos + ID + IP + locale + link al admin
- replyTo: email del lead → admin responde directo

**Lead (ES):**
> Hola {Nombre},
> Recibimos tu solicitud de acceso al catálogo Yutro Casting. Te contactamos dentro de las próximas 24 horas hábiles…

**Lead (EN):**
> Hi {Name},
> We received your access request to the Yutro Casting catalog. We'll get in touch within 24 business hours…

## Slack opcional

Si `SLACK_WEBHOOK_URL` está seteado, posta:
```
:envelope: *Nueva solicitud Casting* — Empresa
*Tipo:* X · *Plazo:* Y · *Presupuesto:* Z
*Lead:* Nombre <email> · *Rol:* role
*ID:* `<uuid>`
```

Si falla, log a console.error pero no afecta el response.

## Admin listing `/studio/admin/access-requests`

- `requireAdmin()` gate (mismo patrón que otros admin pages)
- Tabla read-only: Fecha, Empresa, Nombre+Email, Proyecto, Plazo, Presupuesto, Status
- Status badge con tones distintos (pending/contacted/qualified/converted/disqualified)
- Email clickeable (`mailto:`)
- Last 200 rows ordenados desc por fecha
- Nota visible: "Cambio de status manual via SQL por ahora — admin UI completo en backlog."

## Archivos modificados / creados

### Nuevos
- `src/lib/access-request/schema.ts` — Zod + FIELD_LABELS + BLOCKED_EMAIL_DOMAINS
- `src/lib/access-request/emails.ts` — Resend templates + Slack
- `src/app/api/access-request/route.ts` — endpoint POST
- `src/components/casting/AccessRequestForm.tsx` — client form
- `src/app/[locale]/studio/admin/access-requests/page.tsx` — admin listing
- `drizzle/0008_access_requests.sql`
- `.ai/changelog-sprint-3.md`

### Modificados
- `src/db/schema.ts` — `accessRequests` table added
- `src/app/[locale]/casting/solicitar-acceso/page.tsx` — stub → real
- `messages/{es,en}.json` — namespace `casting.request`
- `.env.example` — `ADMIN_NOTIFY_EMAIL`, `SLACK_WEBHOOK_URL` documentados

## Variables de entorno requeridas

| Var | Requerida | Default | Para qué |
|---|---|---|---|
| `RESEND_API_KEY` | Sí (si querés emails) | none | Cliente Resend. Sin esto se loguea warning y se skipea el email. |
| `EMAIL_FROM_NAME` | No | `"Yutro"` | From name |
| `EMAIL_FROM_ADDRESS` | No | `noreply@yutro.cl` | From address |
| `ADMIN_NOTIFY_EMAIL` | No | `EMAIL_TO` → `contacto@yutro.cl` | Destino del email admin |
| `SLACK_WEBHOOK_URL` | No | unset | Si presente, postea a Slack |

## Verificaciones

- `npx tsc --noEmit --skipLibCheck`: ✅ exit 0
- `messages/*.json`: ✅ JSON válido
- Schema CHECK en DB: ✅ status enforcement activa
- RLS deny-all: ✅ enabled

## Decisiones nuevas (extendiendo `.ai/decisions.md`)

### D-016 · Honeypot silencioso (200 fake)

**Contexto:** El brief sugiere "honeypot anti-spam... si viene lleno descarta el submit". No especifica response code.

**Decisión:** Si el honeypot está lleno, devolver `200 OK` con `id: "honeypot"`, sin guardar en DB. El bot piensa que tuvo éxito y no reintenta.

**Justificación:** Devolver 400 le diría al bot "intentá de otra forma". Devolver 200 lo desactiva permanentemente.

### D-017 · Notificaciones no bloquean response

**Contexto:** Si esperamos a que Resend confirme antes de responder, agregamos ~500-2000ms al request del usuario. Si Resend está degradado, el usuario ve el form colgado.

**Decisión:** `Promise.allSettled` paralelo + `Promise.race(notify, sleep(1000))` antes del response. El usuario ve la confirmación rápido. Vercel Fluid mantiene la lambda viva hasta que las promises terminen, así que los emails se mandan igual.

**Justificación:** Si Resend falla, el lead YA está en DB. El admin lo ve igual en `/studio/admin/access-requests`. La notificación es nice-to-have, no critical path.

### D-018 · Rate limit fail-open

**Contexto:** Si la query de rate-limit (count by IP en última hora) falla, ¿qué hacemos?

**Decisión:** Fail-open. Log error y procede con el insert. Mejor un duplicado ocasional que perder un lead por un blip de DB.

**Justificación:** Los rate-limits son para spam masivo, no para casos edge. Un attacker decidido bypassea con VPN igual.

### D-019 · Admin listing solo read

**Contexto:** Brief Tarea 3.3 dice "tabla con todos los `access_requests` ordenados por fecha desc, con acción para marcar status". Es opcional.

**Decisión:** Hice la tabla pero sin el toggle de status. Cambios de status van por SQL hasta que se agregue UI completo.

**Justificación:** Hacer el toggle de status bien requiere un PATCH endpoint con audit log + optimistic update + revalidatePath. Es 30-40 min más de trabajo. Lo dejé en backlog para no inflar Sprint 3.

## Backlog nuevo

### DT-013 · Status edit UI en admin

`src/app/[locale]/studio/admin/access-requests/page.tsx` muestra status read-only. Agregar:
1. Endpoint `PATCH /api/studio/admin/access-requests/[id]/status`
2. UI con `<select>` por fila + onChange → fetch + optimistic
3. Audit log entry vía `logAuditEventServer`

### DT-014 · Email "marca leído" para evitar follow-ups duplicados

Cuando el admin contacta al lead, el siguiente miembro del equipo no debería contactarlo otra vez. Agregar columna `contacted_at` + indicador visual en la tabla.

### DT-015 · Re-validación de email corporativo en cliente debounced

Hoy el chequeo de `BLOCKED_EMAIL_DOMAINS` se hace por cada keystroke (computación trivial, no es problema real). Si la lista crece a 200+ dominios, podría sentirse pesado en mobile. Considerar `useDeferredValue`.

### DT-016 · Public email endpoint timeout config

`/api/access-request` no tiene timeout explícito. En Vercel Fluid el default de 300s es overkill para esto. Setear `export const maxDuration = 30` para fail-fast si Resend cuelga.

## Para revisión humana

1. **Texto del email al lead**: redacción editorial conservadora. Si Yutro quiere algo más casual ("¡Bienvenido al Casting!"), cambio en `src/lib/access-request/emails.ts:renderLeadHtml/Text`.

2. **`replyTo` en email admin = email del lead**: cuando Yutro le da reply al notification email, va directo al lead. Si preferís que vaya a un thread interno, cambialo a `EMAIL_CC` o sacar la línea.

3. **`SLACK_WEBHOOK_URL`**: si querés Slack, créame el webhook en el workspace, lo configurás en Vercel env vars y empieza a postear. Sin la env var, no hace nada (silent).

4. **Listado admin**: el límite de 200 filas es arbitrario. Si llegamos a 200 leads sería un excelente problema; podemos agregar paginación o filtros en Sprint 4.

## Para Sprint 4

Lo último del brief: sitemap.xml dinámico (incluye `/casting`, `/casting/[slug]`, excluye `/studio/*`), robots.txt, Open Graph + schema.org final, analytics check, Lighthouse score targets.
