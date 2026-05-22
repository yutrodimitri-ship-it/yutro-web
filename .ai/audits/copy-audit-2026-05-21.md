# Copy Audit — Yutro (sitio completo)

**Fecha:** 2026-05-21
**Auditor:** Claude (copy strategist mode)
**Alcance:** TODO el sitio — capa pública nueva (`/`, `/casting/*`, `/estudio`, `/produccion`) + módulo privado (`/studio/talent/*`)
**Continuación de:** `copy-audit-2026-05-20.md` (que cubría solo el módulo privado)

---

## 1. Veredicto general

El sitio funciona y cada pantalla individualmente está bien escrita. **El problema no es la calidad del copy pantalla por pantalla — es la coherencia entre pantallas.**

Un visitante que recorre home → /casting → ficha → solicitar-acceso → (eventualmente) el área privada se encuentra con **el mismo concepto llamado de 6 formas distintas** y **la marca escrita de 3 formas distintas**. Eso erosiona la sensación de un producto único y pensado.

| Problema | Gravedad | Instancias |
|---|---|---|
| El personaje IA tiene 6 nombres | 🔴 Alta | ~15 |
| La marca tiene 3 nombres | 🔴 Alta | ~9 |
| El funnel no nombra explícitamente los pasos | 🟠 Media | flujo completo |
| "Casting" se usa para 2 cosas distintas | 🟠 Media | 4 |

---

## 2. Hallazgo central — el personaje IA tiene 6 nombres

El producto que Yutro vende — un personaje generado con IA, con identidad consistente, para campañas — se llama, según dónde mires:

| Término | Dónde aparece | Veces |
|---|---|---|
| **"roster"** | /casting, /estudio, home | 7 |
| **"personajes IA"** | /casting, home CastingPreview | 3 |
| **"casting digital"** | home hero | 2 |
| **"talento digital" / "talentos digitales"** | /casting título, NDA privado | 3 |
| **"avatares IA"** | catálogo privado, landing privada | 2 |
| **"personajes digitales"** | /estudio manifiesto | 1 |

Un cliente que lee la home ("casting digital propio"), entra al /casting ("Talento digital con identidad" + "roster curado de personajes IA"), abre una ficha, y más adelante entra al área privada ("Catálogo de avatares IA") — recibió **cinco palabras para una sola cosa**. No sabe si "avatar", "personaje", "talento" y "casting digital" son lo mismo o productos distintos.

### Esto NO es un detalle estético

En venta B2B, la claridad del sustantivo central ES el producto. Si Yutro no puede nombrar consistentemente lo que vende, el cliente no puede explicárselo a su jefe para aprobar el presupuesto.

---

## 3. Hallazgo — la marca tiene 3 nombres

| Término | Dónde | Veces |
|---|---|---|
| **"Yutro"** | capa pública (header, footer, /estudio) | correcto |
| **"Yutro Studio"** | módulo privado (i18n `studio.talent.*`) | 7 |
| **"Casting House"** | landing privada | 2 |

El brief original (§0) fue explícito:

> "**Yutro a secas** es la marca pública única. 'Studio', 'Talent' y 'Casting House' son términos técnicos o categorías, no nombres de marca visibles."

La capa pública nueva cumple. El módulo privado (que viene de antes y se tocó en `feat/studio-visual`) sigue diciendo "Yutro Studio" en 7 lugares y "Casting House" en 2.

---

## 4. Hallazgo — "Casting" significa dos cosas

La palabra "Casting" se usa para:

1. **La sección pública** — `/casting`, "el Casting", "Ver el Casting" (= el lookbook/catálogo)
2. **La acción** — "tu casting", "casting cart", "arma tu casting" (= la selección que arma el cliente)

Que el contenedor y la acción se llamen igual genera frases ambiguas: "Ver mi casting" ¿es ver la sección o ver mi selección?

---

## 5. Glosario canónico propuesto

**Decisión pendiente del usuario** (sección 8). Mi recomendación:

| Concepto | Término canónico recomendado | Por qué |
|---|---|---|
| El personaje IA | **"talento digital"** (sing.) / **"talentos digitales"** (pl.) | Cohere con "Casting" (un casting selecciona talentos), con "roster" (un roster es una lista de talentos), y con la categoría "casting house". Es el término de la industria publicitaria. |
| Variación descriptiva ocasional | "personaje IA" permitido como aposición ("talentos digitales — personajes IA con identidad…") | Da variedad sin romper el canon |
| ❌ Evitar | "avatar" | Connota foto de perfil / avatar de videojuego, no casting profesional |
| ❌ Evitar | "casting digital" como sinónimo del personaje | "Casting" se reserva para la sección |
| La marca | **"Yutro"** | Brief §0 |
| ❌ Evitar | "Yutro Studio", "Casting House" como marca visible | Son categorías internas |
| La sección pública | **"el Casting"** / **"Casting"** | Ya es así |
| La selección del cliente | **"tu selección"** (no "tu casting") | Desambigua del nombre de la sección |
| El conjunto de talentos | **"el elenco"** (ES) / "the roster" (EN) | "roster" es jerga inglesa que no se entiende en español; "elenco" es el término de la industria del casting. EN mantiene "roster" (palabra normal en inglés). |

---

## 6. Auditoría por superficie

### 6.1 Home — Hero

```
"Producción audiovisual con IA y casting digital propio."
"Para campañas que ya no esperan."
```

⚠️ "casting digital propio" — acá "casting" se usa como sinónimo del personaje/servicio. Con el glosario canónico debería ser:

**Propuesta:** `"Producción audiovisual con IA y talento digital propio."`

(Mantiene el paralelo "producción … y talento", las dos líneas del estudio.)

### 6.2 Home — CastingPreview

```
eyebrow: "Casting · Vol. 01 · 2026"
"El Casting ya está abierto."
"Roster curado de personajes IA para campañas publicitarias en LATAM…"
```

⚠️ "personajes IA" → debería ser "talentos digitales".
✅ "El Casting" como sección — correcto.

### 6.3 /casting — Hero

```
"Talento digital con identidad."
"Roster curado de personajes IA para campañas publicitarias en LATAM…"
```

⚠️ El H1 dice "Talento digital" (✅ canon) pero el intro dice "personajes IA" (✗). Dos términos en la MISMA pantalla, a 3 líneas de distancia. Es el caso más visible del problema.

**Propuesta intro:** `"Roster curado de talentos digitales para campañas publicitarias en LATAM…"`

### 6.4 /casting — secciones

```
"Featured Talent"   /   "Casting estándar"
```

⚠️ "Featured Talent" en inglés en un sitio cuyo idioma primario es español. El brief permitía "Featured Talent" como nombre del tier — es defendible como término propio. Pero "Casting estándar" mezcla español + el "Casting"-como-sección-vs-tier.

**Propuesta:** `"Talentos Featured"` / `"Roster general"` — o si se quiere mantener "Featured" como label de tier (válido), entonces `"Featured"` / `"Roster general"` a secas.

### 6.5 /casting/[slug] — ficha

✅ Mayormente coherente. Usa "talento" correctamente en el CTA ("¿Querés trabajar con {name}?").
⚠️ El campo de ficha "Registro de estilo" (= phenotype) es vago — un productor no sabe qué esperar ahí. Sugerencia: "Fenotipo" o "Tipo físico".

### 6.6 /casting/solicitar-acceso

✅ Copy claro, el flujo de 3 pasos explica bien qué pasa después.
⚠️ "catálogo completo" vs "el Casting" vs "roster privado" — 3 formas de nombrar lo mismo (lo que hay detrás del form). Unificar a "el catálogo completo".

### 6.7 /estudio — manifiesto

✅ Bien escrito.
⚠️ "personajes digitales" en p2 → "talentos digitales".
⚠️ Las dos líneas se llaman "Casting" y "Producción" — bien. Pero el manifiesto p1 habla de "casting físico" (el tradicional). Acá "casting" significa el proceso, no la sección. Es aceptable porque el contexto lo aclara ("casting físico"), pero conviene tenerlo en el radar.

### 6.8 Módulo privado /studio/talent/*

Ver `copy-audit-2026-05-20.md` para el detalle. Estado tras `feat/studio-visual`:
- ✅ "briefia" (palabra inventada) — corregido
- ⚠️ "Yutro Studio" (×7) — sigue. Debería ser "Yutro".
- ⚠️ "avatares IA" (×2) — sigue. Debería ser "talentos digitales".
- ⚠️ "Casting House" (×2) — sigue. Sacar como marca visible.

---

## 7. La narrativa del funnel — ¿el usuario entiende el camino?

El recorrido ideal del visitante:

```
Home → entiende que Yutro hace producción + casting
  ↓
/casting → ve el lookbook, entiende el producto
  ↓
ficha de talento → se enamora de un personaje concreto
  ↓
/casting/solicitar-acceso → pide acceso
  ↓
(Yutro lo contacta, contrato)
  ↓
/studio/talent → área privada, arma su selección real
```

**Evaluación:** el camino FUNCIONA estructuralmente — cada pantalla tiene un CTA al paso siguiente. Pero **no se nombra a sí mismo**. El usuario nunca lee algo como "esto es un anticipo / el catálogo completo está detrás de un acuerdo". Lo intuye, no se lo dicen.

**Recomendación:** un micro-copy de orientación en `/casting`, una línea bajo el hero:

> *"Esto es el catálogo público — una selección. El roster completo se abre tras una conversación con el estudio."*

Eso convierte la fricción ("¿por qué no puedo ver todo?") en valor percibido ("hay más, y es exclusivo").

---

## 8. Decisiones que necesito del usuario

Antes de aplicar correcciones masivas, 2 decisiones de marca que cascadean a ~24 lugares:

1. **¿Cómo llamamos al personaje IA?** (recomiendo "talento digital")
2. **¿Unificamos la marca a "Yutro" también en el módulo privado?** (el brief decía que sí, pero el privado estaba fuera de scope; ahora que mergeamos studio-visual, podemos)

---

## 9. Plan de corrección (una vez decidido el glosario)

| Prioridad | Cambio | Superficie | Esfuerzo |
|---|---|---|---|
| 🔴 1 | Unificar el nombre del personaje IA en TODO el sitio | i18n es/en + home hero hardcoded | Medio |
| 🔴 2 | "Yutro Studio"/"Casting House" → "Yutro" en módulo privado | i18n `studio.talent.*` | Bajo |
| 🟠 3 | Micro-copy de orientación bajo el hero de /casting | i18n `casting.hero` | Muy bajo |
| 🟠 4 | "tu casting" → "tu selección" donde aplique | i18n privado | Bajo |
| 🟡 5 | "Casting estándar" → "Roster general" | i18n `casting.sections` | Muy bajo |
| 🟡 6 | "Registro de estilo" → "Fenotipo" en ficha | i18n `casting.detail.fields` | Muy bajo |
| 🟢 7 | Unificar "catálogo completo" en solicitar-acceso | i18n `casting.request` | Muy bajo |

Todo es i18n + 1 string hardcoded. Cero cambios de lógica. ~30-40 min de ejecución una vez aprobado el glosario.
