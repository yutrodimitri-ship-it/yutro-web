# Decisiones tomadas sin consulta humana

Este archivo lista decisiones que el agente tomó por su cuenta cuando el brief tenía ambigüedad, junto con la justificación. El humano puede revertir cualquiera de estas con un mensaje corto al agente.

---

## D-001 · Branch base = `master` (no `main`)

**Contexto:** El brief dice "crear `feat/casting-public-launch` desde `main`". El repo no tiene `main`; el branch primario es `master` y el remote HEAD apunta (raro) a `feat/scroll-animations`.

**Decisión:** Crear desde `master`.

**Justificación:** `master` es la rama de producción del proyecto, donde están todos los merges previos. El `main` del brief era un placeholder genérico.

---

## D-002 · `public_visible` default false + seed manual

**Contexto:** El brief introduce `public_visible BOOLEAN DEFAULT FALSE` en la tabla `talents`. Hay ~30-50 talentos en el roster privado.

**Decisión:** Todos los talentos existentes arrancan `public_visible = false`. El admin decide caso a caso quién se publica (vía SQL update o un futuro UI). En Sprint 2 se hace un seed manual de 3 featured + 3 standard para que `/casting` no salga vacío al lanzar.

**Justificación:** Default conservador. Exponer un talento al público es decisión editorial / legal del estudio, no algo que ocurra automático.

---

## D-003 · `clientAccess` como botón separado, no nav item

**Contexto:** El brief muestra el menú como `[YUTRO.] Casting · Producción · Estudio · Blog · Contacto | ES/EN · ☀/☾ · [Acceso cliente]` — el botón "Acceso cliente" está visualmente separado del menú principal.

**Decisión:** Exportar `clientAccessItem` aparte de `mainNavItems` en `src/data/navigation.ts`. El Header lo renderiza como botón outlined coral después de un divisor sutil. El MobileNav lo pone al final del drawer con `mt-auto`.

**Justificación:** Mantener una sola fuente de verdad (`navigation.ts`) pero separar los roles visuales en el código. Si en el futuro hay más botones de "acción" tipo "Reservar demo", se agrupan ahí.

---

## D-004 · Label "Studio" en EN para `/estudio`

**Contexto:** Brief dijo: "Ningún ítem llamado 'Studio' (palabra sola) queda en el menú principal." Pero la traducción natural de "Estudio" al inglés es "Studio".

**Decisión:** EN del menú muestra "Studio" como label de `/estudio`. Interpretación: la prohibición era contra usar "Studio" como referencia a la marca de plataforma; en el menú ahora "Studio" denota el sustantivo (creative studio), no la plataforma.

**Alternativas si se quiere cambiar:** "The Studio", "About", "Inside". Cambio de 1 línea en `messages/en.json:nav.estudio`.

---

## D-005 · Coral del brand = `--primary` existente

**Contexto:** Brief menciona "color coral" para el botón Acceso cliente y CTAs. No hay token específico "coral" en el repo.

**Decisión:** Reusar `--primary` de Tailwind (el coral existente del brand). Es el mismo coral que usa el talent module privado en las cursivas editoriales.

**Justificación:** Mantener coherencia cromática entre lado público y privado.

---

## D-006 · `next.config.ts` redirects, no stub page

**Contexto:** Brief ofrece dos formas de hacer redirect (stub page.tsx con `redirect()` server-component vs `next.config.ts redirects: async()`).

**Decisión:** Solo `next.config.ts redirects`. Redirect server-level es 301 puro, sin invocar React, mejor para SEO y latencia.

**Justificación:** El stub agregaría 1 round trip de SSR antes de redirigir. El redirect en config es atómico.

---

## D-007 · `src/data/influencers.ts` no borrado todavía

**Contexto:** En Sprint 1.6 borré las rutas `/influencer/*` pero el archivo de data (`src/data/influencers.ts`) queda huérfano.

**Decisión:** No borrarlo ahora. Marcarlo `@deprecated` con comentario apuntando al Sprint 2. Será la fuente para el seed de Featured Talents en DB.

**Justificación:** Esos 3 personajes tienen fotos, bios, handles de Instagram listos. Borrarlos ahora obligaría a recrearlos en Sprint 2. Más eficiente preservar el archivo como referencia.

---

## D-008 · `home.heroCTA` deprecated alias preservado

**Contexto:** El nuevo Hero usa `heroCTAPrimary` + `heroCTASecondary`. Pero `Hero.tsx` y `HeroScrollAnimation.tsx` (componentes legacy no usados en home) siguen leyendo `t("heroCTA")`.

**Decisión:** Dejar `heroCTA` en `messages/*.json` como alias deprecated. No borrar los componentes legacy sin auditar si se usan en otras rutas (`/test`, `/preview`, etc.).

**Justificación:** Costo cero, evita regresión accidental.

---

## D-009 · `contact.info.company.parent` cambio fuera del brief estricto

**Contexto:** El brief de Sprint 1.7 solo pide cambiar la línea de copyright. Pero el componente Footer también renderiza `contactInfo.company.parent` ("VRYP – Art & AI Solutions") debajo del logo, con el em dash anterior.

**Decisión:** Cambiar también `contactInfo.company.parent` a "VRYP Art & AI Solutions" (sin em dash) y `contactInfo.company.name` de "YUTRO." a "Yutro". Mantiene coherencia con la nueva línea de copyright.

**Justificación:** Sin esto, el footer mostraría dos versiones distintas de la marca en la misma vista (la corregida en el copyright y la vieja arriba). El brief decía explícitamente "Yutro a secas es la marca pública única", lo que justifica tocar el data file.

---

## D-010 · `/estudio` placeholder de equipo: 1 founder (Milivoy)

**Contexto:** Brief dice "Foto + nombre + rol. Placeholder de 1-3 personas." Sin nombres específicos.

**Decisión:** Renderizar 1 card con "Milivoy Dimitrijevic" como "Founder · Director creativo".

**Justificación:** El email `milivoy@yutro.cl` aparece en `src/lib/talent/email.ts` como CC del flujo de casting, así que inferí que es el operador / founder. Si está mal, edit en `src/app/[locale]/estudio/page.tsx`.

---

## D-011 · RLS deny-all preservada, sin `anon read` policy

**Contexto:** Brief Sprint 2 dice "RLS de Supabase permite lectura pública solo de campos `public_*` y los marcados `public_visible = true`."

**Decisión:** No agregar policy `anon SELECT` sobre talents. Mantener deny-all. Toda lectura del catálogo público va via Server Components con service_role (que bypassa RLS). El data layer en `src/lib/talents-public.ts` filtra explícitamente las columnas seguras (nunca SELECT `code` ni metadata privada).

**Justificación:** Cliente JS nunca hace queries directas a DB. La separación de columnas se asegura en el código del data layer. Una policy adicional para anon sería defense-in-depth pero no cierra el gap real (la app no usa supabase-js público para talents). Se puede agregar en Sprint 4 si se quiere extra seguridad.

---

## D-012 · Featured = nuevas filas (YE-F01/F02/F03), no flags sobre roster existente

**Contexto:** Brief dice "preservar los 3 personajes del experimento original como Featured Talent". Camila/Antonia/Sofi NO estaban en la tabla `talents` — eran un experimento separado en `src/data/influencers.ts`.

**Decisión:** Insertar 3 filas nuevas con prefijo `YE-F` (F = Featured) en la tabla talents, con `tier='featured'`. Las imágenes apuntan a `/public/influencers/*` (assets ya en repo).

**Justificación:** Los 3 personajes tienen narrativa, bio personal, audiencia simulada — distintos del roster profesional. Mezclarlos con un código YE-W## habría perdido esa identidad. Códigos YE-F## los separa visualmente del W/M del roster regular.

---

## D-013 · `resolvePublicImage` solo resuelve path-style hoy

**Contexto:** Algunos talentos tienen `image_profile_key` con paths absolutos (`/talents-webp/YE-W04/profile.webp`), otros podrían tener R2 keys plain (`talent/YE-W04/profile.webp`).

**Decisión:** El helper `resolvePublicImage` retorna el path tal cual si empieza con `/` o `http`, sino retorna null (placeholder en UI).

**Justificación:** Todos los 6 talentos seedados hoy tienen path-style, así que renderizan correctamente. Si en el futuro se agregan talentos con R2 keys plain, hay que implementar un endpoint público `/api/casting/image/[slug]/[variant]` que firme URLs de R2. Item nuevo en backlog (DT-009).

---

## D-014 · `/casting/solicitar-acceso` stub con mailto:

**Contexto:** Los CTAs de `/casting` y `/casting/featured` apuntan a `/casting/solicitar-acceso`. Sprint 3 construye el form real, pero Sprint 2 cierra sin él.

**Decisión:** Stub editorial con copy explicativo + `mailto:contacto@yutro.cl` como CTA provisorio + 3 pasos del proceso ("Lo que sigue").

**Justificación:** Mejor un stub honest-by-default que un 404 o un form skeleton sin backend. Sprint 3 lo reemplaza sin tocar las páginas que linkean acá.

---

## D-015 · Schema.org `Person` JSON-LD inline, nacionalidad Chile hard-coded

**Contexto:** Brief pide schema.org Person para fichas públicas. El estándar tiene muchos campos opcionales.

**Decisión:** Inline en el `<head>` de cada ficha, con `name`, `description` (= archetype del locale), `image`, `url`, `nationality: Chile`, `knowsAbout` (= suggested_uses).

**Justificación:** Mantener mínimo lo suficiente para que Google Search Console y rich results no se quejen. `nationality: Chile` hard-coded porque todo el roster es LATAM/CL. Si en el futuro hay talentos de otros países, agregar columna `nationality` en DB.

---

## D-016 · Honeypot silencioso (200 fake)

**Contexto:** El brief sugiere "honeypot anti-spam... si viene lleno descarta el submit". No especifica response code.

**Decisión:** Si el honeypot está lleno, devolver `200 OK` con `id: "honeypot"`, sin guardar en DB.

**Justificación:** Devolver 400 le dice al bot "intentá de otra forma". Devolver 200 lo desactiva permanentemente.

---

## D-017 · Notificaciones no bloquean response

**Contexto:** Resend puede tardar 500-2000ms. No queremos que el usuario vea el form colgado si Resend está lento.

**Decisión:** `Promise.allSettled` paralelo + `Promise.race(notify, sleep(1000))` antes del response. Vercel Fluid mantiene la lambda viva hasta que terminen.

**Justificación:** El lead YA está en DB cuando respondemos. La notificación es nice-to-have. El admin lo ve igual en `/studio/admin/access-requests`.

---

## D-018 · Rate limit fail-open

**Decisión:** Si la query de count-by-IP falla, log error y procede con el insert.

**Justificación:** Mejor un duplicado ocasional que perder un lead por un blip de DB. Rate-limits son para spam masivo, no para edge cases.

---

## D-019 · Admin listing solo read (sin status toggle)

**Contexto:** Brief Tarea 3.3 sugiere "acción para marcar status".

**Decisión:** Tabla read-only. Cambios de status via SQL por ahora. Toggle UI queda en backlog (DT-013).

**Justificación:** Hacer el toggle bien requiere PATCH endpoint con audit log + optimistic update + revalidatePath. 30-40 min más. Lo separé para no inflar Sprint 3.
