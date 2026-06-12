-- Sprint 3 — Solicitudes de acceso al Casting (form publico).
--
-- Aplicado en Supabase via MCP el 2026-05-21 (migration
-- sprint3_access_requests). Este archivo mantiene la cadena de
-- migraciones del repo en paridad.

CREATE TABLE IF NOT EXISTS access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  country TEXT,
  project_type TEXT,
  timeline TEXT,
  budget_range TEXT,
  attribution TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'qualified', 'disqualified', 'converted')),
  ip_address TEXT,
  user_agent TEXT,
  locale TEXT NOT NULL DEFAULT 'es'
);

CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_created ON access_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_requests_ip_recent
  ON access_requests(ip_address, created_at DESC);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
-- No policies — deny-all por defecto.
-- service_role bypass (lo usa el endpoint del server y el admin reader).
