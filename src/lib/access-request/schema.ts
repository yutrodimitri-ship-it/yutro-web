import { z } from "zod";

/**
 * Schema compartido cliente + servidor para el form
 * /casting/solicitar-acceso. El endpoint valida con el mismo schema
 * que el form usa para la UI — single source of truth.
 */

export const PROJECT_TYPES = [
  "campaign",
  "retail-catalog",
  "social-content",
  "hero-spot",
  "exploring",
] as const;

export const TIMELINES = ["this-month", "next-90-days", "no-deadline"] as const;

export const BUDGET_RANGES = [
  "under-5k",
  "5k-15k",
  "15k-50k",
  "over-50k",
  "prefer-discuss",
] as const;

export const ATTRIBUTIONS = [
  "referral",
  "google",
  "instagram",
  "linkedin",
  "event",
  "other",
] as const;

export const COUNTRIES = [
  "CL",
  "AR",
  "PE",
  "CO",
  "MX",
  "BR",
  "UY",
  "EC",
  "ES",
  "US",
  "OTHER",
] as const;

export const accessRequestSchema = z.object({
  name: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  email: z.string().trim().toLowerCase().email("Email inválido").max(200),
  // Campos opcionales — el form simplificado ya no los pide, pero el
  // endpoint los sigue aceptando (compatibilidad con clientes viejos).
  company: z.string().trim().max(160).optional().or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES).optional(),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  country: z.enum(COUNTRIES).optional(),
  timeline: z.enum(TIMELINES).optional(),
  budgetRange: z.enum(BUDGET_RANGES).optional(),
  attribution: z.enum(ATTRIBUTIONS).optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  // Honeypot. Si llega lleno es bot → endpoint descarta silenciosamente.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;

// Helpers para mostrar labels traducidas en el form. El backend
// guarda los slugs en DB; las labels las renderiza el cliente con
// i18n.
export const FIELD_LABELS = {
  projectType: {
    es: {
      campaign: "Campaña publicitaria",
      "retail-catalog": "Catálogo retail",
      "social-content": "Contenido para social",
      "hero-spot": "Hero spot",
      exploring: "Estoy explorando",
    },
    en: {
      campaign: "Advertising campaign",
      "retail-catalog": "Retail catalog",
      "social-content": "Social content",
      "hero-spot": "Hero spot",
      exploring: "Just exploring",
    },
  },
  timeline: {
    es: {
      "this-month": "Este mes",
      "next-90-days": "Próximos 90 días",
      "no-deadline": "Sin plazo definido",
    },
    en: {
      "this-month": "This month",
      "next-90-days": "Next 90 days",
      "no-deadline": "No deadline",
    },
  },
  budgetRange: {
    es: {
      "under-5k": "Menos de USD 5K",
      "5k-15k": "USD 5K – 15K",
      "15k-50k": "USD 15K – 50K",
      "over-50k": "Más de USD 50K",
      "prefer-discuss": "Prefiero conversarlo",
    },
    en: {
      "under-5k": "Under USD 5K",
      "5k-15k": "USD 5K – 15K",
      "15k-50k": "USD 15K – 50K",
      "over-50k": "Over USD 50K",
      "prefer-discuss": "Prefer to discuss",
    },
  },
  attribution: {
    es: {
      referral: "Referido",
      google: "Búsqueda Google",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      event: "Evento o charla",
      other: "Otro",
    },
    en: {
      referral: "Referral",
      google: "Google Search",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      event: "Event or talk",
      other: "Other",
    },
  },
  country: {
    es: {
      CL: "Chile",
      AR: "Argentina",
      PE: "Perú",
      CO: "Colombia",
      MX: "México",
      BR: "Brasil",
      UY: "Uruguay",
      EC: "Ecuador",
      ES: "España",
      US: "Estados Unidos",
      OTHER: "Otro",
    },
    en: {
      CL: "Chile",
      AR: "Argentina",
      PE: "Peru",
      CO: "Colombia",
      MX: "Mexico",
      BR: "Brazil",
      UY: "Uruguay",
      EC: "Ecuador",
      ES: "Spain",
      US: "United States",
      OTHER: "Other",
    },
  },
} as const;
