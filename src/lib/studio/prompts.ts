// YUTRO Studio — Prompt building logic
// Migrated from pipeline-runner.js custom nodes to TypeScript

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

/**
 * Build portrait prompt for Z-Image Turbo
 * Migrated from pipeline-runner.js buildPortraitPrompt()
 */
export function buildPortraitPrompt(params: PortraitParams): string {
  const parts: string[] = [
    "RAW photo portrait of a",
    params.gender === "Mujer" ? "woman" : params.gender === "Hombre" ? "man" : "person",
    `, age ${params.ageRange || "25"}, ${params.ethnicity || "European"} features`,
  ];

  if (params.hairColor) parts.push(`, ${params.hairColor} hair`);
  if (params.hairCut) parts.push(`, ${params.hairCut} hairstyle`);
  if (params.hairTexture) parts.push(`, ${params.hairTexture} hair texture`);
  if (params.hairLength) parts.push(`, ${params.hairLength} hair length`);
  if (params.eyeColor) parts.push(`, ${params.eyeColor} eyes`);
  if (params.eyeShape) parts.push(`, ${params.eyeShape} eyes`);
  if (params.skinTone) parts.push(`, ${params.skinTone} skin tone`);
  if (params.skinSubtone) parts.push(`, ${params.skinSubtone} undertone`);

  parts.push(
    ", wearing a plain black fitted t-shirt, solid black with no logos",
    ", neutral composed expression, white background, pure white studio backdrop",
    ", soft natural lighting from camera left, diffused daylight, 85mm portrait lens",
    ", f/2.8 shallow depth of field, sharp focus on eyes",
    ", 8K UHD professional photography, DSLR, photorealistic, natural skin texture",
    ", no artificial smoothing, no CGI appearance"
  );

  return parts.join("");
}

/**
 * Build wardrobe enrichment prompt for Gemini Flash
 */
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

/**
 * Build contact sheet base prompt for Gemini Flash enrichment
 * Migrated from YutroContactSheetBase node
 */
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
