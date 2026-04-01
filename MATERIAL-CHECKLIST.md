# Checklist de Material — YUTRO Web

## Formatos recomendados
- **Imagenes**: JPG o WebP, max 1200px de ancho, optimizadas (<300KB)
- **Portadas de proyecto**: 16:9 (1200x675px)
- **Galeria de proyecto**: Cuadradas 1:1 (800x800px) o 4:3
- **Fotos influencer**: Cuadradas 1:1 (800x800px)
- **Avatares**: Cuadrados 1:1 (400x400px)
- **Videos**: URL de YouTube embed (no se suben archivos)

---

## PROYECTOS (9 proyectos)

Cada proyecto necesita **1 portada + 9 imagenes de galeria**.
Las imagenes van en `public/projects/{nombre}/`

### Mochilas Head
```
public/projects/mochilas-head/
├── mochilas-head.jpg      ← portada (va en la raiz de projects/)
├── 01.jpg
├── 02.jpg
├── 03.jpg
├── 04.jpg
├── 05.jpg
├── 06.jpg
├── 07.jpg
├── 08.jpg
└── 09.jpg
```
**Video**: Cambiar URL en `src/data/projects.ts` → `videoUrl`

### Super Pollo
```
public/projects/super-pollo/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/super-pollo.jpg`

### Santander
```
public/projects/santander/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/santander.jpg`

### Paris Electro
```
public/projects/paris-electro/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/paris-electro.jpg`

### Sprim
```
public/projects/sprim/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/sprim.jpg`

### Zapatillas Falabella
```
public/projects/zapatillas-falabella/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/zapatillas-falabella.jpg`

### Proyecto MG
```
public/projects/proyecto-mg/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/proyecto-mg.jpg`

### Bburago Autos
```
public/projects/bburago-autos/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/bburago-autos.jpg`

### Frutos de Chile
```
public/projects/frutos-de-chile/
├── 01.jpg a 09.jpg
```
Portada: `public/projects/frutos-de-chile.jpg`

**Total proyectos: 9 portadas + 81 imagenes galeria = 90 imagenes**

---

## INFLUENCERS (3 avatares)

Cada influencer necesita **1 avatar + 4 highlights + 9 fotos galeria**.
Las imagenes van en `public/influencers/{nombre}/`

### Luna (@luna.ai)
```
public/influencers/luna/
├── avatar.jpg        ← foto de perfil (cuadrada)
├── hl-01.jpg         ← highlight "Moda"
├── hl-02.jpg         ← highlight "BTS"
├── hl-03.jpg         ← highlight "Collabs"
├── hl-04.jpg         ← highlight "Viajes"
├── 01.jpg a 09.jpg   ← galeria
```
**Video Reel**: Cambiar URL en `src/data/influencers.ts` → `reelUrl`

### Kai (@kai.ai)
```
public/influencers/kai/
├── avatar.jpg
├── hl-01.jpg         ← "Gaming"
├── hl-02.jpg         ← "Tech"
├── hl-03.jpg         ← "Reels"
├── hl-04.jpg         ← "Setup"
├── 01.jpg a 09.jpg
```

### Nova (@nova.ai)
```
public/influencers/nova/
├── avatar.jpg
├── hl-01.jpg         ← "Beauty"
├── hl-02.jpg         ← "Skincare"
├── hl-03.jpg         ← "Collabs"
├── hl-04.jpg         ← "Wellness"
├── 01.jpg a 09.jpg
```

**Total influencers: 3 avatares + 12 highlights + 27 fotos = 42 imagenes**

---

## VIDEOS (URLs de YouTube)

Editar directamente en los archivos de datos:

| Archivo | Campo | Donde |
|---------|-------|-------|
| `src/data/projects.ts` | `videoUrl` | Cada proyecto |
| `src/data/influencers.ts` | `reelUrl` | Cada influencer |

Formato: `https://www.youtube.com/embed/VIDEO_ID`

---

## LOGO (opcional)

Si tienes el logo de YUTRO en PNG/SVG:
```
public/logo.png        ← para JSON-LD schema
public/logo-dark.png   ← version para tema oscuro (si existe)
```

---

## RESUMEN TOTAL

| Tipo | Cantidad |
|------|----------|
| Portadas proyecto | 9 |
| Galeria proyecto | 81 |
| Avatares influencer | 3 |
| Highlights influencer | 12 |
| Galeria influencer | 27 |
| Logo | 1-2 |
| Videos (URLs) | 12 |
| **TOTAL imagenes** | **~134** |
