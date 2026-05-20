CREATE TABLE "casting_submissions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"project_slug" varchar(64) NOT NULL,
	"user_email" varchar(254) NOT NULL,
	"shortlist" jsonb NOT NULL,
	"exclusives" jsonb NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"idempotency_key" varchar(64) NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" uuid
);
--> statement-breakpoint
CREATE TABLE "nda_acceptances" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"project_slug" varchar(64) NOT NULL,
	"user_email" varchar(254) NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" varchar(64),
	"user_agent" text,
	"revoked_at" timestamp with time zone,
	"revoked_by" uuid
);
--> statement-breakpoint
CREATE TABLE "talent_access_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"event_type" varchar(32) NOT NULL,
	"user_email" varchar(254) NOT NULL,
	"project_slug" varchar(64) NOT NULL,
	"talent_code" varchar(16),
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_address" varchar(64),
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talent_project_access" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
	"project_slug" varchar(64) NOT NULL,
	"user_email" varchar(254) NOT NULL,
	"granted_by" uuid,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "talent_projects" (
	"slug" varchar(64) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"client" text NOT NULL,
	"contact_email" varchar(254) NOT NULL,
	"contact_name" text NOT NULL,
	"market" text NOT NULL,
	"rights_duration_es" text NOT NULL,
	"rights_duration_en" text NOT NULL,
	"exclusivity_mode" varchar(16) NOT NULL,
	"exclusivity_category_es" text,
	"exclusivity_category_en" text,
	"exclusivity_help_es" text NOT NULL,
	"exclusivity_help_en" text NOT NULL,
	"max_talents" integer NOT NULL,
	"max_exclusive" integer NOT NULL,
	"start_date" date NOT NULL,
	"blocked_talent_codes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" varchar(16) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talents" (
	"code" varchar(16) PRIMARY KEY NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text NOT NULL,
	"short_desc_es" text NOT NULL,
	"short_desc_en" text NOT NULL,
	"phenotype_es" text NOT NULL,
	"phenotype_en" text NOT NULL,
	"archetype_es" text NOT NULL,
	"archetype_en" text NOT NULL,
	"tone_commercial_es" text NOT NULL,
	"tone_commercial_en" text NOT NULL,
	"gender" varchar(1) NOT NULL,
	"age_range" varchar(16) NOT NULL,
	"age_bucket" varchar(4) NOT NULL,
	"category" varchar(24) NOT NULL,
	"status" varchar(16) DEFAULT 'available' NOT NULL,
	"market" jsonb NOT NULL,
	"suggested_uses" jsonb NOT NULL,
	"hue" integer NOT NULL,
	"sat" integer NOT NULL,
	"image_profile_key" text,
	"image_charsheet_key" text,
	"gallery_keys" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "casting_submissions" ADD CONSTRAINT "casting_submissions_project_slug_talent_projects_slug_fk" FOREIGN KEY ("project_slug") REFERENCES "public"."talent_projects"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "casting_submissions" ADD CONSTRAINT "casting_submissions_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nda_acceptances" ADD CONSTRAINT "nda_acceptances_project_slug_talent_projects_slug_fk" FOREIGN KEY ("project_slug") REFERENCES "public"."talent_projects"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nda_acceptances" ADD CONSTRAINT "nda_acceptances_revoked_by_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_project_access" ADD CONSTRAINT "talent_project_access_project_slug_talent_projects_slug_fk" FOREIGN KEY ("project_slug") REFERENCES "public"."talent_projects"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_project_access" ADD CONSTRAINT "talent_project_access_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "casting_idempotency_unique" ON "casting_submissions" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "casting_project_idx" ON "casting_submissions" USING btree ("project_slug","submitted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "nda_unique_active" ON "nda_acceptances" USING btree ("project_slug","user_email");--> statement-breakpoint
CREATE INDEX "audit_project_time_idx" ON "talent_access_logs" USING btree ("project_slug","timestamp");--> statement-breakpoint
CREATE INDEX "audit_user_time_idx" ON "talent_access_logs" USING btree ("user_email","timestamp");--> statement-breakpoint
CREATE UNIQUE INDEX "talent_project_access_unique" ON "talent_project_access" USING btree ("project_slug","user_email");--> statement-breakpoint
CREATE INDEX "talent_project_access_email_idx" ON "talent_project_access" USING btree ("user_email");