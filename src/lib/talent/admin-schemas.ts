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
] as const;
export const TALENT_STATUSES = ["available", "in-campaign", "reserved"] as const;
export const PROJECT_STATUSES = ["active", "pending", "closed"] as const;
export const EXCLUSIVITY_MODES = ["none", "category", "total"] as const;
export const SUBMISSION_STATUSES = [
  "pending",
  "confirmed",
  "rejected",
] as const;

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
  market: z.array(z.string().min(1).max(8)).min(1).max(10),
  suggestedUses: z.array(localeStringSchema).max(10).default([]),
  status: z.enum(TALENT_STATUSES),
  hue: z.number().int().min(0).max(360),
  sat: z.number().int().min(0).max(100),
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
  contactEmail: z.email().max(254),
  contactName: z.string().min(1).max(200),
  market: z.string().min(1).max(64),
  rightsDurationEs: z.string().min(1).max(100),
  rightsDurationEn: z.string().min(1).max(100),
  exclusivityMode: z.enum(EXCLUSIVITY_MODES),
  exclusivityCategoryEs: z.string().max(200).nullable().optional(),
  exclusivityCategoryEn: z.string().max(200).nullable().optional(),
  exclusivityHelpEs: z.string().min(1).max(500),
  exclusivityHelpEn: z.string().min(1).max(500),
  maxTalents: z.number().int().min(1).max(50),
  maxExclusive: z.number().int().min(0).max(50),
  industrySector: z.string().max(100).default(""),
  rightsDurationMonths: z.number().int().min(1).max(120).default(12),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date yyyy-mm-dd"),
  blockedTalentCodes: z.array(z.string().max(16)).default([]),
  status: z.enum(PROJECT_STATUSES),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
