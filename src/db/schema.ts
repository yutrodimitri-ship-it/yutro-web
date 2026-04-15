import { pgTable, uuid, text, inet, timestamp, integer, boolean, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
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
