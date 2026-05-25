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
  | "oficios"
  | "artistico"
  | "profesional";
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
  /** Bio narrativa larga del talento. Opcional — fallback a placeholder si falta. */
  bio?: Partial<LocaleString>;
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
  /** Score editorial 0-5: marca "anclas" del catálogo en el shuffle balanceado. */
  editorialScore?: number;
}

export type ProjectStatus = "active" | "pending" | "closed";

export interface ProjectConfig {
  slug: string;
  name: string;
  client: string;
  market: string;
  /** Categoría de industria del proyecto (Telco, Banca, ...). */
  categoryEs: string;
  maxTalents: number;
  maxExclusive: number;
  /** Duración derechos en meses (3, 6, 12, 18 o 24). Define la ventana de bloqueo de talentos. */
  rightsDurationMonths: number;
  /** ISO date (yyyy-mm-dd). */
  startDate: string;
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
