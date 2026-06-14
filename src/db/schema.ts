import { pgTable, uuid, text, inet, timestamp, integer, boolean, jsonb, uniqueIndex, index, varchar, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// UUID v7 default — uses the function created in init-db.sql
const uuidV7Default = sql`uuid_generate_v7()`;

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    phone: text("phone"),
    message: text("message").notNull(),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_contact_created").on(table.createdAt),
    index("idx_contact_email").on(table.email),
  ]
);

// ─── Studio: usuarios ───

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("client"),
    isActive: boolean("is_active").notNull().default(true),
    canAccessIntel: boolean("can_access_intel").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_users_email").on(table.email),
  ]
);

// ─────────────────────────────────────────────────
// YUTRO STUDIO TALENT — tablas Fase 2 (Sprint 5)
// ─────────────────────────────────────────────────

export const talents = pgTable("talents", {
  code: varchar("code", { length: 16 }).primaryKey(), // YE-W07
  // bilingual
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  shortDescEs: text("short_desc_es").notNull(),
  shortDescEn: text("short_desc_en").notNull(),
  phenotypeEs: text("phenotype_es").notNull(),
  phenotypeEn: text("phenotype_en").notNull(),
  archetypeEs: text("archetype_es"),
  archetypeEn: text("archetype_en"),
  toneCommercialEs: text("tone_commercial_es").notNull(),
  toneCommercialEn: text("tone_commercial_en").notNull(),
  bioEs: text("bio_es"),
  bioEn: text("bio_en"),
  // attrs
  gender: varchar("gender", { length: 1 }).notNull(),
  ageRange: varchar("age_range", { length: 16 }).notNull(),
  ageBucket: varchar("age_bucket", { length: 4 }).notNull(),
  category: varchar("category", { length: 24 }).notNull(),
  status: varchar("status", { length: 16 }).default("available").notNull(),
  market: jsonb("market").$type<string[]>().notNull(),
  suggestedUses: jsonb("suggested_uses")
    .$type<{ es: string; en: string }[]>()
    .notNull(),
  // visual placeholder (Sprint 5) + futuras URLs (Sprint 8)
  hue: integer("hue").notNull(),
  sat: integer("sat").notNull(),
  imageProfileKey: text("image_profile_key"),
  imageCharsheetKey: text("image_charsheet_key"),
  galleryKeys: jsonb("gallery_keys")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  /** Score editorial 0-5: marca "anclas" del catálogo (los más icónicos). */
  editorialScore: integer("editorial_score").notNull().default(0),
  // Sprint 2 — capa publica del catalogo (yutro.cl/casting). Solo
  // talentos con public_visible=true salen del area privada y aparecen
  // en el lookbook publico. Featured = tier separado con IG embed.
  publicVisible: boolean("public_visible").notNull().default(false),
  tier: text("tier").notNull().default("standard"), // CHECK ('standard'|'featured') en DB
  // Tier COMERCIAL (precio) — distinto de `tier` (visibilidad de vitrina).
  // El admin lo setea manualmente. Hito 3: badge en ficha + regla de carrito.
  commercialTier: text("commercial_tier").notNull().default("standard"), // CHECK ('standard'|'premium')
  instagramHandle: text("instagram_handle"),
  instagramFollowers: integer("instagram_followers"),
  publicBioEs: text("public_bio_es"),
  publicBioEn: text("public_bio_en"),
  // Slug publico URL-friendly, separado del code interno (YE-W01) para
  // que el SEO publico no exponga la nomenclatura del roster. UNIQUE
  // parcial via index en DB — null permitido.
  publicSlug: text("public_slug"),
  // soft delete
  isActive: boolean("is_active").notNull().default(true),
  // sentinel for downstream tables — see below
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const talentProjects = pgTable("talent_projects", {
  slug: varchar("slug", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  client: text("client").notNull(),
  market: text("market").notNull(),
  categoryEs: text("category_es").notNull(),
  maxTalents: integer("max_talents").notNull(),
  maxExclusive: integer("max_exclusive").notNull(),
  // Regla de composición del carrito (Hito 3): máx talentos Premium permitidos
  // en la shortlist. null = sin límite.
  maxPremium: integer("max_premium"),
  rightsDurationMonths: integer("rights_duration_months").notNull().default(12),
  startDate: date("start_date").notNull(),
  // Brief narrativo de campaña (Hito 4): contexto para producir el material.
  briefText: text("brief_text"),
  status: varchar("status", { length: 16 }).default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relacion N:M emails autorizados x proyecto (un email puede ver varios proyectos)
export const talentProjectAccess = pgTable(
  "talent_project_access",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    projectSlug: varchar("project_slug", { length: 64 })
      .notNull()
      .references(() => talentProjects.slug, { onDelete: "cascade" }),
    userEmail: varchar("user_email", { length: 254 }).notNull(),
    grantedBy: uuid("granted_by").references(() => users.id),
    grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("talent_project_access_unique").on(t.projectSlug, t.userEmail),
    index("talent_project_access_email_idx").on(t.userEmail),
  ]
);

export const castingSubmissions = pgTable(
  "casting_submissions",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    projectSlug: varchar("project_slug", { length: 64 })
      .notNull()
      .references(() => talentProjects.slug),
    userEmail: varchar("user_email", { length: 254 }).notNull(),
    shortlist: jsonb("shortlist").$type<string[]>().notNull(),
    exclusives: jsonb("exclusives").$type<string[]>().notNull(),
    status: varchar("status", { length: 16 }).default("pending").notNull(),
    // hash de idempotencia: project + sortedList + minuto de timestamp
    idempotencyKey: varchar("idempotency_key", { length: 64 }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    adminNotes: text("admin_notes"),
    emailDeliveryStatus: varchar("email_delivery_status", { length: 16 }), // 'sent' | 'failed' | null
  },
  (t) => [
    uniqueIndex("casting_idempotency_unique").on(t.idempotencyKey),
    index("casting_project_idx").on(t.projectSlug, t.submittedAt),
  ]
);

// Hito 3 — registro formal de derechos. Una fila por talento comprometido
// en una submission confirmada. La ventana [start, end] se calcula del
// proyecto (startDate + rightsDurationMonths). El cron de vencimiento la
// marca 'expired' al pasar license_end; el release/reject la marca 'released'.
export const talentLicenses = pgTable(
  "talent_licenses",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    talentCode: varchar("talent_code", { length: 16 })
      .notNull()
      .references(() => talents.code),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => castingSubmissions.id, { onDelete: "cascade" }),
    projectSlug: varchar("project_slug", { length: 64 })
      .notNull()
      .references(() => talentProjects.slug),
    licenseStart: date("license_start").notNull(),
    licenseEnd: date("license_end").notNull(),
    isExclusive: boolean("is_exclusive").notNull().default(false),
    // active = derechos vigentes | expired = venció | released = liberado por admin
    status: varchar("status", { length: 16 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    closedAt: timestamp("closed_at", { withTimezone: true }),
  },
  (t) => [
    index("license_talent_end_idx").on(t.talentCode, t.licenseEnd),
    index("license_status_end_idx").on(t.status, t.licenseEnd),
    index("license_submission_idx").on(t.submissionId),
  ]
);

export const ndaAcceptances = pgTable(
  "nda_acceptances",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    projectSlug: varchar("project_slug", { length: 64 })
      .notNull()
      .references(() => talentProjects.slug, { onDelete: "cascade" }),
    userEmail: varchar("user_email", { length: 254 }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).defaultNow().notNull(),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => users.id),
  },
  (t) => [
    uniqueIndex("nda_unique_active").on(t.projectSlug, t.userEmail),
  ]
);

export const talentAccessLogs = pgTable(
  "talent_access_logs",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    eventType: varchar("event_type", { length: 32 }).notNull(),
    userEmail: varchar("user_email", { length: 254 }).notNull(),
    projectSlug: varchar("project_slug", { length: 64 }).notNull(),
    talentCode: varchar("talent_code", { length: 16 }),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    ipAddress: varchar("ip_address", { length: 64 }),
    timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("audit_project_time_idx").on(t.projectSlug, t.timestamp),
    index("audit_user_time_idx").on(t.userEmail, t.timestamp),
  ]
);

// ─── Existing tables ───

export const rateLimitEntries = pgTable(
  "rate_limit_entries",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    key: text("key").notNull(),
    count: integer("count").default(1),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_rate_limit_key").on(table.key),
    index("idx_rate_limit_reset").on(table.resetAt),
  ]
);

// Sprint 3 — Solicitudes de acceso al catalogo completo desde
// /casting/solicitar-acceso. RLS deny-all en DB; toda lectura/escritura
// pasa por service_role en el endpoint o admin server component.
export const accessRequests = pgTable(
  "access_requests",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company").notNull(),
    role: text("role"),
    country: text("country"),
    projectType: text("project_type"),
    timeline: text("timeline"),
    budgetRange: text("budget_range"),
    attribution: text("attribution"),
    notes: text("notes"),
    status: text("status").notNull().default("pending"), // CHECK in DB
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    locale: text("locale").notNull().default("es"),
  },
  (table) => [
    index("idx_access_requests_status").on(table.status),
    index("idx_access_requests_created").on(table.createdAt),
    index("idx_access_requests_ip_recent").on(table.ipAddress, table.createdAt),
  ]
);
