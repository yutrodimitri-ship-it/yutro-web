/**
 * Zod schemas compartidos por las APIs admin de Talent.
 * Reutilizables tanto en routes server-side como en validacion client-side.
 */
import { z } from "zod";

export const TALENT_GENDERS = ["m", "f"] as const;
export const TALENT_AGE_BUCKETS = ["20s", "30s", "40s", "50s"] as const;
export const TALENT_CATEGORIES = [
  "corporativo",
  "lifestyle",
  "familiar",
  "urbano",
  "senior",
  "oficios",
  "artistico",
  "profesional",
] as const;
export const TALENT_STATUSES = ["available", "in-campaign", "reserved"] as const;
export const PROJECT_STATUSES = ["active", "pending", "closed"] as const;
export const SUBMISSION_STATUSES = [
  "pending",
  "confirmed",
  "rejected",
] as const;

/** Opciones del dropdown de duración de derechos (en meses). */
export const RIGHTS_DURATION_OPTIONS = [3, 6, 12, 18, 24] as const;
export type RightsDurationOption = (typeof RIGHTS_DURATION_OPTIONS)[number];

/** Sectores de industria publicitaria para el dropdown de categoría exclusiva. */
export const INDUSTRY_CATEGORIES = [
  "Telco",
  "Banca",
  "Retail",
  "Bebestibles",
  "Alimentos",
  "Belleza",
  "Automotriz",
  "Tecnología",
  "Salud",
  "Educación",
  "Inmobiliaria",
  "Turismo",
  "Seguros",
  "Energía",
  "Moda",
  "Hogar",
] as const;
export type IndustryCategory = (typeof INDUSTRY_CATEGORIES)[number];

const localeStringSchema = z.object({
  es: z.string().min(1).max(200),
  en: z.string().min(1).max(200),
});

export const talentInputSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(16)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase alphanumeric with dashes"),
  nameEs: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  shortDescEs: z.string().min(1).max(200),
  shortDescEn: z.string().min(1).max(200),
  gender: z.enum(TALENT_GENDERS),
  ageRange: z.string().min(1).max(16),
  ageBucket: z.enum(TALENT_AGE_BUCKETS),
  phenotypeEs: z.string().min(1).max(200),
  phenotypeEn: z.string().min(1).max(200),
  archetypeEs: z.string().min(1).max(200),
  archetypeEn: z.string().min(1).max(200),
  category: z.enum(TALENT_CATEGORIES),
  toneCommercialEs: z.string().min(1).max(200),
  toneCommercialEn: z.string().min(1).max(200),
  bioEs: z.string().max(2000).nullable().optional(),
  bioEn: z.string().max(2000).nullable().optional(),
  market: z.array(z.string().min(1).max(8)).min(1).max(10),
  suggestedUses: z.array(localeStringSchema).max(10).default([]),
  status: z.enum(TALENT_STATUSES),
  hue: z.number().int().min(0).max(360),
  sat: z.number().int().min(0).max(100),
  editorialScore: z.number().int().min(0).max(5).default(0),
  isActive: z.boolean().default(true),
});

export type TalentInput = z.infer<typeof talentInputSchema>;

export const talentUpdateSchema = talentInputSchema.partial().extend({
  // code es immutable en updates
});

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  name: z.string().min(1).max(200),
  client: z.string().min(1).max(200),
  market: z.string().min(1).max(64),
  categoryEs: z.enum(INDUSTRY_CATEGORIES),
  maxTalents: z.number().int().min(1).max(50),
  maxExclusive: z.number().int().min(0).max(50),
  rightsDurationMonths: z
    .number()
    .int()
    .refine(
      (n) => (RIGHTS_DURATION_OPTIONS as readonly number[]).includes(n),
      { message: "Duración debe ser 3, 6, 12, 18 o 24 meses" }
    ),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date yyyy-mm-dd"),
  status: z.enum(PROJECT_STATUSES),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
