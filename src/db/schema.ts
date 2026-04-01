import { pgTable, uuid, text, inet, timestamp, integer, uniqueIndex, index } from "drizzle-orm/pg-core";
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
