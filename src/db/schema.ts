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

// ─── Studio: Avatar Generation SaaS ───

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull().default("client"),
    credits: integer("credits").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    canAccessIntel: boolean("can_access_intel").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_users_email").on(table.email),
  ]
);

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    userId: uuid("user_id").notNull().references(() => users.id),
    status: text("status").notNull().default("pending"),
    gender: text("gender").notNull(),
    ageRange: text("age_range").notNull(),
    ethnicity: text("ethnicity").notNull(),
    hairTexture: text("hair_texture"),
    hairCut: text("hair_cut"),
    hairLength: text("hair_length"),
    hairColor: text("hair_color"),
    eyeShape: text("eye_shape"),
    eyeColor: text("eye_color"),
    skinTone: text("skin_tone"),
    skinSubtone: text("skin_subtone"),
    wardrobePreset: text("wardrobe_preset").notNull(),
    errorMessage: text("error_message"),
    comfyPromptIds: jsonb("comfy_prompt_ids"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_generations_user").on(table.userId, table.createdAt),
    index("idx_generations_status").on(table.status),
  ]
);

export const generationImages = pgTable(
  "generation_images",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    generationId: uuid("generation_id").notNull().references(() => generations.id),
    step: integer("step").notNull(),
    storagePath: text("storage_path").notNull(),
    publicUrl: text("public_url").notNull(),
    filename: text("filename").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_gen_images_generation").on(table.generationId),
  ]
);

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").primaryKey().default(uuidV7Default),
    userId: uuid("user_id").notNull().references(() => users.id),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    generationId: uuid("generation_id").references(() => generations.id),
    adminId: uuid("admin_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_credit_tx_user").on(table.userId, table.createdAt),
  ]
);

// ─── Existing tables ───

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
  archetypeEs: text("archetype_es").notNull(),
  archetypeEn: text("archetype_en").notNull(),
  toneCommercialEs: text("tone_commercial_es").notNull(),
  toneCommercialEn: text("tone_commercial_en").notNull(),
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
  // soft delete
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const talentProjects = pgTable("talent_projects", {
  slug: varchar("slug", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  client: text("client").notNull(),
  contactEmail: varchar("contact_email", { length: 254 }).notNull(),
  contactName: text("contact_name").notNull(),
  market: text("market").notNull(),
  rightsDurationEs: text("rights_duration_es").notNull(),
  rightsDurationEn: text("rights_duration_en").notNull(),
  exclusivityMode: varchar("exclusivity_mode", { length: 16 }).notNull(),
  exclusivityCategoryEs: text("exclusivity_category_es"),
  exclusivityCategoryEn: text("exclusivity_category_en"),
  exclusivityHelpEs: text("exclusivity_help_es").notNull(),
  exclusivityHelpEn: text("exclusivity_help_en").notNull(),
  maxTalents: integer("max_talents").notNull(),
  maxExclusive: integer("max_exclusive").notNull(),
  startDate: date("start_date").notNull(),
  blockedTalentCodes: jsonb("blocked_talent_codes")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
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
