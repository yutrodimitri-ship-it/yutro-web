// YUTRO Studio — Prompt building logic
// Ported from yutro_v1.3.0_FINAL custom node (YutroPortraitZImageEN)
// Uses the exact same mappings and prompt structure that was tested with Z-Image Turbo

// ═══════════════════════════════════════════════════════════════════════
// MAPPINGS — from data/mappings_*.py v1.3.0
// ═══════════════════════════════════════════════════════════════════════

const GENERO_MAP: Record<string, string> = {
  Mujer: "cisgender woman",
  Hombre: "cisgender man",
};

const EDAD_MAP: Record<string, { age: number; descriptor: string }> = {
  "Adolescente (16-22)": { age: 19, descriptor: "youthful appearance, teenage to young adult features, fresh faced, adolescent characteristics" },
  "Joven adulto (23-32)": { age: 27, descriptor: "young adult appearance, mature but youthful features, prime adult age characteristics" },
  "Adulto (33-45)": { age: 38, descriptor: "mature adult appearance, established adult features, mid-life characteristics" },
  "Adulto mayor (46-60)": { age: 52, descriptor: "middle-aged appearance, mature features with early aging signs, distinguished look" },
  "Senior (60+)": { age: 65, descriptor: "senior appearance, aged features, retirement age characteristics, visible aging" },
};

const ETNIA_MAP: Record<string, string> = {
  "Mestizo Chileno": "Chilean mestizo appearance, mixed European and Indigenous South American ancestry, typical Chilean facial features, medium brown skin tone, dark hair, brown eyes, common Chilean phenotype",
  Europeo: "Chilean of European Caucasian descent, predominantly European features, fair to light skin tone, variety of hair colors including brown blonde or light brown, blue green hazel or light brown eyes, European facial structure",
  "Asiático": "Asian-Chilean appearance, East Asian descent features, Asian phenotype with Chilean identity, light to medium skin tone, straight black hair, epicanthic eye folds, characteristic Asian facial structure",
  Afrodescendiente: "Afro-Chilean appearance, African descent features, Black Chilean phenotype, dark brown to black skin tone, coily or kinky hair texture, African facial characteristics with Chilean cultural context",
  "Árabe": "Chilean of Palestinian descent, Middle Eastern Arab features, olive to tan skin tone, dark hair, dark eyes, Levantine Arab facial characteristics, Palestinian ancestry phenotype",
  "Indígena Latinoamericano": "Mapuche Indigenous appearance from Araucanía region, native Chilean Indigenous features, Indigenous South American phenotype, copper to brown skin tone, straight black hair, dark brown eyes, prominent cheekbones, characteristic Mapuche facial structure",
  Mixto: "Chilean mestizo appearance, mixed ethnic background, diverse facial features combining multiple ancestries, unique mixed phenotype",
};

const CORTE_PELO_MAP: Record<string, string> = {
  "Sin definir": "natural unstyled hair, no specific haircut style, hair growing naturally without defined cut",
  "Bob Clásico": "classic bob haircut, hair cut straight around head at jaw level, blunt even hemline, timeless one-length bob, chin-length hair all around",
  Pixie: "pixie cut hairstyle, short feminine haircut with tapered back and sides, longer textured top, cropped closely around ears and nape, chic short women's cut",
  "Largo suelto": "long even haircut, long hair cut to one uniform length, straight across hemline at bottom, blunt cut long hair without layers",
  Recogido: "bun hairstyle or updo, hair pulled back and secured up away from face and neck, hair tied into bun on head, elegant upswept hairstyle",
  Trenzas: "braided hairstyle, hair woven into braids, plaited hair in one or more braids, braided hair sections, traditional braiding style",
  Rapado: "buzzcut hairstyle, hair closely cropped to scalp with clippers, very short uniform length all over head, military-style short haircut, nearly shaved head appearance",
  "Crew Cut": "crew cut hairstyle, short tapered military haircut, slightly longer on top than sides, classic short masculine cut, neat professional military style",
  Undercut: "undercut hairstyle, sides and back shaved or cut very short with longer hair on top, dramatic contrast between top and sides, disconnected undercut",
};

const COLOR_PELO_MAP: Record<string, string> = {
  Negro: "black jet black hair color, deep black hair, very dark hair color",
  "Castaño oscuro": "dark brown hair color, deep brown hair, rich dark brown shade",
  "Castaño": "medium brown hair color, chestnut brown hair, typical brown hair shade",
  Rubio: "blonde hair color, golden blonde hair, medium blonde shade",
  Pelirrojo: "red hair color, ginger hair, auburn to bright red hair shade",
  "Gris/Plata": "grey hair color, salt and pepper hair, silvery grey hair",
  Platino: "light blonde hair color, pale blonde hair, platinum to light golden blonde",
};

const FORMA_OJOS_MAP: Record<string, string> = {
  Almendrados: "almond-shaped eyes with tapered ends",
  Redondos: "round eyes with circular visible aperture",
  Rasgados: "upturned eyes with lateral upward slant",
  Hundidos: "deep-set eyes recessed in eye socket",
};

const COLOR_OJOS_MAP: Record<string, string> = {
  "Marrón oscuro": "dark brown eyes, deep brown iris color",
  "Marrón medio": "medium brown eyes, mid-tone brown iris",
  Avellana: "hazel eyes, mixed brown and green tones",
  Verde: "olive green eyes, muted green iris",
  "Azul claro": "light blue eyes, pale blue iris",
  "Azul oscuro": "steel blue eyes, grey-blue metallic tone",
  Gris: "grey eyes, silver-grey iris",
};

const TONO_PIEL_MAP: Record<string, string> = {
  "Muy claro": "very fair skin tone, pale porcelain complexion",
  Claro: "fair skin tone, light complexion",
  Medio: "medium skin tone, average complexion",
  Oliva: "olive skin tone, warm Mediterranean complexion",
  Moreno: "tan skin tone, warm brown complexion",
  Oscuro: "dark skin tone, deep rich complexion",
};

const TEXTURA_PELO_MAP: Record<string, string> = {
  Liso: "straight hair texture, naturally straight smooth hair",
  Ondulado: "wavy hair texture, naturally wavy flowing hair",
  Rizado: "curly hair texture, defined curls and ringlets",
  Afro: "afro hair texture, tightly coiled natural afro hair",
};

const LARGO_PELO_MAP: Record<string, string> = {
  "Muy corto": "very short hair length, cropped close to head",
  Corto: "short hair length, above ear level",
  Medio: "medium hair length, falling between chin and shoulders",
  Largo: "long hair length, past shoulders",
  "Muy largo": "very long hair length, reaching mid-back or longer",
};

// ═══════════════════════════════════════════════════════════════════════
// PORTRAIT PROMPT BUILDER — replicates YutroPortraitZImageEN.generate()
// ═══════════════════════════════════════════════════════════════════════

export interface PortraitParams {
  gender: string;
  ageRange: string;
  ethnicity: string;
  hairColor?: string;
  hairCut?: string;
  hairTexture?: string;
  hairLength?: string;
  eyeColor?: string;
  eyeShape?: string;
  skinTone?: string;
  skinSubtone?: string;
}

export function buildPortraitPrompt(params: PortraitParams): string {
  // Resolve mappings (fall back to raw value if not in map)
  const genderEn = GENERO_MAP[params.gender] || "person";
  const ageData = EDAD_MAP[params.ageRange] || { age: 27, descriptor: "adult" };
  const ethnicityEn = ETNIA_MAP[params.ethnicity] || params.ethnicity + " features";

  // Hair
  const cutEn = (params.hairCut && CORTE_PELO_MAP[params.hairCut]) || "";
  const colorEn = (params.hairColor && COLOR_PELO_MAP[params.hairColor]) || "";
  const textureEn = (params.hairTexture && TEXTURA_PELO_MAP[params.hairTexture]) || "";
  const lengthEn = (params.hairLength && LARGO_PELO_MAP[params.hairLength]) || "";

  // Eyes
  const eyeShapeEn = (params.eyeShape && FORMA_OJOS_MAP[params.eyeShape]) || "";
  const eyeColorEn = (params.eyeColor && COLOR_OJOS_MAP[params.eyeColor]) || "";

  // Skin
  const skinToneEn = (params.skinTone && TONO_PIEL_MAP[params.skinTone]) || "";

  // Build prompt following the exact structure of YutroPortraitZImageEN
  let prompt = "professional medium shot portrait photograph, head and shoulders composition, proper headroom, no cropping of head or shoulders, centered subject, ";
  prompt += `professional portrait photograph of ${genderEn}, `;
  prompt += `age ${ageData.age}, ${ageData.descriptor}, `;
  prompt += `${ethnicityEn}, `;

  // Hair block
  if (cutEn) {
    prompt += cutEn + ", ";
  }
  if (colorEn) {
    prompt += colorEn + ", ";
  }
  if (textureEn) {
    prompt += textureEn + ", ";
  }
  if (lengthEn) {
    prompt += lengthEn + ", ";
  }

  // Eyes block
  if (eyeShapeEn) {
    prompt += eyeShapeEn + ", ";
  }
  if (eyeColorEn) {
    prompt += eyeColorEn + ", ";
  }

  // Skin
  if (skinToneEn) {
    prompt += skinToneEn + ", ";
  }

  // Clothing
  prompt += "wearing a plain black t-shirt, solid black shirt with no logos or text or graphics, simple plain black clothing on upper body, ";

  // Lighting + Expression
  prompt += "soft natural lighting, diffused daylight, gentle even illumination, no harsh shadows, ";
  prompt += "neutral facial expression, calm composed face, relaxed features, ";

  // Background
  prompt += "white background, pure white backdrop, white studio background, clean white solid background, ";

  // Technical (from the tested node)
  prompt += "RAW photo, 8K UHD, DSLR, high quality photograph, film grain, ";
  prompt += "Fujifilm XT3, professional color grading, ";
  prompt += "soft shadows, sharp focus on eyes with catchlight, ";
  prompt += "professional studio portrait, ";
  prompt += "85mm f/1.4 lens, shallow depth of field, bokeh background effect, ";
  prompt += "professional color correction, clean detailed skin texture, ";
  prompt += "fully clothed person, no nudity, professional appropriate attire, ";
  prompt += "no logos visible, no text on clothing, no watermarks, ";
  prompt += "professional portrait photography standards";

  return prompt;
}

// ═══════════════════════════════════════════════════════════════════════
// WARDROBE & CONTACT SHEET PROMPTS (unchanged)
// ═══════════════════════════════════════════════════════════════════════

export const WARDROBE_PRESETS: Record<string, string> = {
  Athleisure:
    "modern athleisure outfit, fitted joggers, sleek sneakers, cropped hoodie or sporty zip-up, minimal accessories, clean urban athletic style",
  "Avant-Garde":
    "avant-garde fashion, architectural silhouette, asymmetric layers, bold unconventional garment, editorial high-fashion style",
  "Business Elegant":
    "elegant business attire, well-tailored suit or structured dress, silk blouse, pointed heels, refined professional elegance",
  "Business Professional":
    "formal business outfit, classic suit with crisp white shirt, leather shoes, professional corporate look",
  "Cocktail Ready":
    "cocktail party outfit, fitted midi dress or sharp blazer with dress pants, statement jewelry, elegant evening style",
  "Corporate Casual":
    "corporate casual look, tailored chinos or skirt, neat polo or knit top, loafers, polished but relaxed office style",
  "Evening Elegant":
    "evening gown or formal suit, luxurious fabrics, elegant draping, heels or dress shoes, red carpet ready",
  "Executive Suit":
    "premium executive suit, double-breasted or perfectly tailored, silk tie or scarf, luxury watch, power dressing",
  "Layered Casual":
    "layered casual outfit, denim jacket over graphic tee, casual pants, sneakers, effortless layered street style",
  "Minimalist Fashion":
    "minimalist fashion, clean lines, neutral tones, high-quality basics, simple elegant silhouette, Scandinavian aesthetic",
  "Night Out":
    "elegant fitted black dress or stylish evening wear, heels or ankle boots, minimal jewelry, sophisticated chic evening style",
  "Smart Business":
    "smart business look, slim-fit blazer, dress shirt, tailored pants, oxford shoes, modern professional style",
  "Smart Casual":
    "smart casual outfit, well-fitted jeans or chinos, button-up shirt or blouse, clean leather shoes, polished relaxed look",
  "Sporty Active":
    "athletic leggings, fitted sports top or jacket, running shoes, hair in ponytail, energetic sporty activewear",
  "Streetwear Premium":
    "premium streetwear, designer hoodie or oversized tee, cargo pants, high-end sneakers, gold chain, urban luxury",
  "Summer Casual":
    "light summer outfit, linen shorts or sundress, sandals, sunglasses, breezy warm-weather casual style",
  "Urban Streetwear":
    "urban streetwear, oversized jacket, straight leg jeans, chunky sneakers, cap or sunglasses, contemporary street look",
  "Vintage Retro":
    "vintage retro outfit, 70s or 80s inspired, high-waisted pants, retro print shirt, vintage accessories, nostalgic fashion",
  "Weekend Relaxed":
    "relaxed weekend outfit, comfortable sweater or hoodie, casual pants, clean sneakers, cozy approachable style",
  "Yoga Casual":
    "yoga-inspired casual wear, soft leggings, loose tank top or wrap, barefoot or minimal sandals, serene mindful style",
};

export function buildWardrobePrompt(preset: string, gender: string): string {
  const wardrobeDetails = WARDROBE_PRESETS[preset] ?? WARDROBE_PRESETS["Smart Casual"];
  const genderWord = gender === "Mujer" ? "woman" : gender === "Hombre" ? "man" : "person";

  return `You are a professional fashion photographer.
Analyze this person's exact appearance: face shape, skin tone, freckles, hair color and style, eye color, body type.
Then write a detailed image generation prompt for this exact same ${genderWord} wearing: ${wardrobeDetails}.
Rules:
- Describe their specific facial features (not generic)
- Full body visible from head to toe, standing pose, studio lighting, light gray background
- The clothing must fit naturally on their specific body type
- Maintain exact same facial features, hair, and skin tone from reference
- End with: "photorealistic, professional fashion photography, 8K quality"
Output ONLY the prompt text, no explanations or headers.`;
}

export function buildContactSheetPrompt(characterDescription: string): string {
  return `You are a professional photography director specializing in character-consistent contact sheets.
Analyze the person in this reference image carefully:
- Describe their exact facial features (face shape, skin tone, freckles, eye color, hair)
- Describe their exact outfit and clothing in detail
- Note their body type and proportions

Then create a seamless 3x3 photographic contact sheet prompt of the same person.
CHARACTER: ${characterDescription}
GRID: Exactly 9 shots in a 3x3 seamless grid. NO borders, NO white lines, NO frames between cells.
SHOTS:
1. Full body, neutral standing, white studio background
2. Medium shot, confident walking, urban street
3. Close-up portrait, direct gaze, soft bokeh
4. Full body, dynamic pose, park setting
5. Medium shot, natural laugh, cafe interior
6. Full body, editorial fashion pose, minimal studio
7. Close-up, side profile, clean background
8. Medium shot, seated casual, indoor lifestyle setting
9. Full body, confident stride, city environment
CONSISTENCY: Same face, hair, skin tone, and outfit in ALL 9 shots. Only pose, angle, and background change.
FORMAT: Professional fashion photography, 16:9 aspect ratio, seamless grid.

For EACH of the 9 shots add: "same person as in reference image, wearing [describe their exact outfit]"
CRITICAL: The person MUST look identical in all 9 shots.
Output ONLY the enhanced prompt text, no explanations.`;
}
