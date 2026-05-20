-- Add intel access column to users table
ALTER TABLE "users" ADD COLUMN "can_access_intel" boolean DEFAULT false NOT NULL;