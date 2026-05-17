/**
 * Yutro Estudio Talent — type definitions.
 *
 * Modulo de licenciamiento de talento digital. Estos tipos se construyen
 * pensando en Fase 2 (Drizzle schema) — el shape de Talent y ProjectConfig
 * se mapea 1:1 a futuras tablas Postgres.
 */

export type Locale = "es" | "en";
export type LocaleString = Record<Locale, string>;

export type TalentGender = "m" | "f";
export type TalentAgeBucket = "20s" | "30s" | "40s" | "50s";
export type TalentCategory =
  | "corporativo"
  | "lifestyle"
  | "familiar"
  | "urbano"
  | "senior"
  | "oficios";
export type TalentStatus = "available" | "in-campaign" | "reserved";

export interface Talent {
  /** Codigo unico (YE-W07, YE-M14). Actua como PK en Fase 1; FK futura. */
  code: string;
  name: LocaleString;
  shortDesc: LocaleString;
  gender: TalentGender;
  /** Rango etario formateado para display (ej. "32-38"). Locale-neutral. */
  ageRange: string;
  ageBucket: TalentAgeBucket;
  phenotype: LocaleString;
  archetype: LocaleString;
  category: TalentCategory;
  toneCommercial: LocaleString;
  /** ISO-style codes ("CL", "LATAM", "US") — traducibles en runtime. */
  market: string[];
  suggestedUses: LocaleString[];
  status: TalentStatus;
  /** Hue para el SVG placeholder (0-360). Fallback cuando no hay imagen real. */
  hue: number;
  /** Saturacion para el SVG placeholder (0-100). */
  sat: number;
  /** R2 key del profile shot (3:4) — null si solo hay placeholder SVG. Sprint 8+. */
  imageProfileKey?: string | null;
  /** R2 key del charsheet (3:4 full body). Sprint 8+. */
  imageCharsheetKey?: string | null;
  /** R2 keys de galerias 1:1 (studio + lifestyle). Sprint 8+. */
  galleryKeys?: string[];
}

export type ExclusivityMode = "none" | "category" | "total";

export type ProjectStatus = "active" | "pending" | "closed";

export interface ProjectConfig {
  slug: string;
  name: string;
  client: string;
  /** Email del contacto cliente (controla acceso al modulo Talent). */
  contactEmail: string;
  contactName: string;
  market: string;
  rightsDuration: LocaleString;
  exclusivityMode: ExclusivityMode;
  exclusivityCategory?: LocaleString;
  exclusivityHelp: LocaleString;
  maxTalents: number;
  maxExclusive: number;
  /** Sector de industria del cliente (ej: "telefonia", "belleza"). */
  industrySector: string;
  /** Duración en meses para calcular ventana de exclusividad. */
  rightsDurationMonths: number;
  /** ISO date (yyyy-mm-dd). */
  startDate: string;
  /** Talent codes excluidos para este proyecto (ya en otra campana, etc.). */
  blockedTalentCodes: string[];
  status: ProjectStatus;
}

/**
 * State del casting en memoria. Exclusives como Set<string> para lookup O(1)
 * y semantica clara de "miembro del set". Persistencia serializa a array.
 */
export interface CastingState {
  shortlist: string[];
  exclusives: Set<string>;
}

export type CastingAction =
  | { type: "ADD"; code: string }
  | { type: "REMOVE"; code: string }
  | { type: "TOGGLE_EXCLUSIVE"; code: string }
  | {
      type: "HYDRATE";
      payload: { shortlist: string[]; exclusives: string[] };
    }
  | { type: "RESET" };
