# Copy Audit — Yutro Studio
**Fecha:** 2026-05-20  
**Auditor:** Claude (copy strategist mode)  
**Alcance:** Módulo Studio Talent — todos los textos visibles al cliente  
**Usuario objetivo:** Productor o director de arte de agencia/marca con acceso invitado al catálogo

---

## 1. Veredicto general

El Studio tiene una estética editorial muy bien ejecutada. El copy de la landing sigue esa lógica con intención. Sin embargo hay **tres tipos de problema** que se mezclan:

| Tipo | Cantidad de instancias | Gravedad |
|------|----------------------|----------|
| Palabra inventada ("briefia") | 2 | Alta — daña credibilidad |
| Inconsistencia en nombres de pantallas | 2–3 | Media — confunde el flujo |
| Copy ambiguo en las 4 bandas editoriales | 1–2 | Baja — ruido estético, no bloquea |

---

## 2. Análisis por pantalla / componente

### 2.1 Landing — Hero (`page.tsx` líneas 114–143)

**Copy actual**
```
Un catálogo de talentos digitales, editado como una revista.

Creamos talentos digitales listos para campaña, contrato y continuidad.
Navega el roster, selecciona con cantidad y briefia a tu productor
en una sola vista.
```

**Diagnóstico**

El headline funciona. La metáfora de la revista es coherente con la estética y se paga visualmente. Ningún cambio necesario ahí.

El párrafo tiene un problema: **"briefia"** no existe en español. Es un verbo inventado sobre la palabra inglesa "brief". Para un cliente (especialmente de agencia grande como Falabella o Santander) leer una palabra inventada en una pantalla que comunica profesionalismo legal puede interrumpir la confianza.

Segundo problema menor: **"selecciona con cantidad"** no está claro. ¿Cantidad de talentos? ¿Cantidades de uso por talento? La ambigüedad no bloquea, pero genera una pausa de lectura innecesaria.

**Propuesta de reescritura**
```
Navega el roster, arma tu selección y envía el brief a tu productor
en una sola vista.
```
*"envía el brief" — preserva la palabra "brief" como sustantivo (sí existe en español de agencia), elimina el verbo inventado. "arma tu selección" ya cubre la idea de cantidad.*

---

### 2.2 Studio Banner (`es.json → studio.banner`)

**Copy actual**
```
Accede al catálogo curado de talentos digitales de Yutro.
Selecciona, licencia y briefia en una sola vista.
```

**Diagnóstico**

Mismo problema que en el hero: **"briefia"**. Aquí es además la primera impresión del usuario antes de ingresar.

**Propuesta**
```
Accede al catálogo curado de talentos digitales de Yutro.
Selecciona, licencia y envía tu brief en una sola vista.
```

---

### 2.3 Las 4 bandas editoriales (`page.tsx → bands[]`)

**Copy actual**

| N° | Título + em | Descripción |
|----|-------------|-------------|
| 01 | "Navega como un **libro.**" | "Un grid de talentos indexados por arquetipo y tipo de licencia. Alterna entre vista editorial y vista de datos." |
| 02 | "Lee un perfil **completo.**" | "Ficha técnica, fotos de firma, capacidad de movimiento. Todo lo que un productor necesita en una sola página." |
| 03 | "Selecciona con **cantidad.**" | "Arma tu shortlist y asigna cantidades por uso. Envía la selección directamente a tu productor." |
| 04 | "Derechos, **resueltos.**" | "Territorios despejados, ventanas de uso claras. Sin misterios de derechos al momento de entrega." |

**Diagnóstico**

Banda 01 y 04: excelentes. El tono es editorial, específico, y comunica beneficios reales.

Banda 02: "fotos de firma" — no es claro. ¿Fotos características? ¿Fotos de identificación? "Capacidad de movimiento" también es vaga para alguien que no sabe qué esperar.

Banda 03: "Selecciona con cantidad" — ambiguo. El cuerpo lo aclara parcialmente ("asigna cantidades por uso") pero el título todavía no funciona solo.

**Propuestas puntuales (sólo las dos que tienen ruido)**

Banda 02:
```
Título: "Lee un perfil completo."
Desc actual: "Ficha técnica, fotos de firma, capacidad de movimiento..."
Desc propuesta: "Ficha técnica, galería de estudio y lifestyle, arquetipo y tono comercial. Todo en una página."
```

Banda 03:
```
Título actual: "Selecciona con cantidad."
Título propuesto: "Arma tu shortlist."

Desc actual: "Arma tu shortlist y asigna cantidades por uso. Envía la selección directamente a tu productor."
Desc propuesta: "Elige los talentos que encajan con tu campaña. Marca quiénes necesitan exclusividad y envía la selección al estudio."
```

---

### 2.4 Inconsistencia: nombre del casting cart

**El problema**

El mismo destino (la pantalla de confirmación de casting) tiene tres nombres distintos en la landing:

| Ubicación | Texto |
|-----------|-------|
| CTA secundario hero (arriba) | "Ver selección" |
| CTA secundario bottom | **"Ver casting cart"** |
| Título de la pantalla de destino | "Tu casting" |

"Casting cart" mezcla inglés en un contexto completamente en español y con tono editorial muy definido. Además no coincide con lo que la pantalla se llama a sí misma.

**Propuesta**

Unificar a un solo nombre en todos los puntos de entrada:

```
"Ver mi casting"   ← ya existe en es.json como "catalog.viewCasting"
```

Cambiar "Ver selección" y "Ver casting cart" → "Ver mi casting" en toda la landing.

---

### 2.5 NDA Modal (`NdaModal.tsx` + `es.json → studio.talent.nda`)

**Copy actual**
```
Eyebrow: "Acceso privado · Sesión proyecto"
Título: "Acuerdo de Confidencialidad"
Subtítulo: "Antes de acceder al catálogo de {project} ({client}), debes aceptar los términos de visualización privada."

Bullets (6):
1. La información mostrada es confidencial y propiedad de VRYP ART & AI SOLUTIONS SPA.
2. No reproducir, distribuir, ni divulgar esta información a terceros.
3. Los talentos digitales son IP exclusiva del estudio. Cliente adquiere licencia de uso de las piezas finales producidas, no del talento.
4. Esta sesión queda registrada con timestamp e IP para trazabilidad legal.
5. Las imágenes contienen marcas de agua identificadoras del cliente, fecha y código del talento.
6. El uso indebido tiene consecuencias legales bajo Ley 19.628 de Chile y normativa aplicable.

Checkbox: "He leído y acepto los términos de visualización privada."
CTA: "Acceder al catálogo"
```

**Diagnóstico**

El NDA está bien escrito para su propósito. El bullet 3 es particularmente importante y claro: distingue la licencia de uso de las piezas versus la IP del talento — un punto que evita confusión contractual futura.

Una sola observación: el bullet 1 nombra a "VRYP ART & AI SOLUTIONS SPA" en el contexto de una pantalla que se llama "Yutro Estudio". Para el cliente que recibió acceso de "Yutro", leer VRYP sin contexto puede generar confusión ("¿firmé con esta empresa?").

**Opción de mejora menor (no urgente)**
```
Bullet 1 actual:
"La información mostrada es confidencial y propiedad de VRYP ART & AI SOLUTIONS SPA."

Opción:
"La información mostrada es confidencial y propiedad de VRYP ART & AI SOLUTIONS SPA (razón social de Yutro Estudio)."
```

---

### 2.6 Catálogo (`es.json → studio.talent.catalog`)

**Copy actual**
```
Título: "Casting {projectName}"
Subtítulo: "Catálogo filtrado para tu proyecto. Solo se muestran talentos disponibles 
para campaña en categoría {category} durante el periodo de la campaña."
```

**Diagnóstico**

La palabra "campaña" aparece dos veces en la misma oración. Leve pero editable.

**Propuesta**
```
Subtítulo: "Catálogo filtrado para tu proyecto. Solo se muestran talentos disponibles 
en categoría {category} durante el periodo definido."
```

---

### 2.7 Pantalla de casting (`es.json → studio.talent.casting`)

**Copy actual**
```
Subtitle: "Paso final · Confirmación de licenciamiento"
Intro: "Revisa los talentos seleccionados y define los términos de licencia. 
Marca individualmente cuáles requieren exclusividad para tu campaña. 
El estudio confirmará disponibilidad y enviará cotización ajustada en menos de 24 horas hábiles."
```

**Diagnóstico**

Correcto y claro. El intro hace exactamente lo que debe: explica qué pasa después de confirmar (expectativa de respuesta en 24 horas). No requiere cambio.

---

### 2.8 Welcome screen (`es.json → studio.talent.welcome`)

**Copy actual**
```
Eyebrow: "Bienvenido · {client}"
Subtitle: "Catálogo curado por Yutro Estudio"
CTA: "Continuar al catálogo"
```

**Diagnóstico**

Limpio y funcional. Sin observaciones.

---

### 2.9 Admin Hub (`es.json → studio.talent.admin`)

**Copy actual**
```
Título: "Talent Admin"
Subtítulo: "Gestiona el catálogo, los proyectos y las selecciones recibidas."
```

**Diagnóstico**

Funcional para uso interno. "Selecciones recibidas" es correcto en contexto. Sin observaciones.

---

## 3. Glosario — inconsistencias terminológicas

| Término A | Término B | Recomendación |
|-----------|-----------|---------------|
| "Ver selección" | "Ver casting cart" | Unificar → "Ver mi casting" |
| "Tu casting" (título pantalla) | "Ver casting cart" (CTA) | Unificar → "Tu casting" |
| "briefia" | — | Eliminar → "envía el brief" |
| "fotos de firma" | — | Reemplazar → "galería de estudio" |
| "selecciona con cantidad" | "asigna cantidades por uso" | Unificar bajo "arma tu shortlist" |

---

## 4. Quick wins priorizados

| Prioridad | Cambio | Archivo | Esfuerzo |
|-----------|--------|---------|----------|
| 🔴 1 | Eliminar "briefia" (×2) → "envía el brief" | `page.tsx` línea 142 + `es.json → studio.banner` | Muy bajo |
| 🔴 2 | Unificar nombre del casting cart → "Ver mi casting" | `page.tsx` líneas 163, 338 | Muy bajo |
| 🟠 3 | Reescribir banda N°03 (título + desc) | `page.tsx → bands[2]` | Bajo |
| 🟡 4 | Aclarar desc banda N°02 ("fotos de firma") | `page.tsx → bands[1]` | Bajo |
| 🟡 5 | Eliminar "campaña" duplicada en subtitle del catálogo | `es.json → studio.talent.catalog.subtitle` | Muy bajo |
| 🟢 6 | Agregar "(razón social de Yutro Estudio)" al NDA bullet 1 | `es.json → studio.talent.nda.bullets.confidential` | Muy bajo |

---

## 5. Lo que NO toqué

- **Headline "Un catálogo de talentos digitales, editado como una revista."** — funciona. No cambiar.
- **Las bandas N°01 y N°04** — sólidas, coherentes con el tono editorial.
- **Todo el flujo de casting** (intro, confirm dialog, submitted state, toasts) — bien escrito, expectativas claras.
- **NDA bullets 2–6** — correctos y necesarios tal como están.
- **Copy del talento detail** (spec labels, status labels, gallery labels) — consistente y funcional.
- **Eyebrow bar de la landing** (Volumen, Para, Catálogo) — refuerza bien la estética editorial.
- **"Los covers de esta edición"** — copy favorito del sitio. No tocar.
