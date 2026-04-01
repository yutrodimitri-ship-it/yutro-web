-- ============================================
-- YUTRO Web — Database Init
-- Solo tablas transaccionales (contenido vive en Sanity)
-- ============================================

-- UUID v7: timestamp-ordered, mejor rendimiento en índices B-tree que UUID v4
CREATE OR REPLACE FUNCTION uuid_generate_v7() RETURNS uuid AS $$
DECLARE
  unix_ts_ms bigint;
  uuid_bytes bytea;
BEGIN
  unix_ts_ms = (extract(epoch from clock_timestamp()) * 1000)::bigint;
  uuid_bytes = set_byte(
    set_byte(
      overlay(
        uuid_send(gen_random_uuid())
        placing substring(int8send(unix_ts_ms) from 3)
        from 1 for 6
      ),
      6, (get_byte(uuid_send(gen_random_uuid()), 6) & 15) | 112
    ),
    8, (get_byte(uuid_send(gen_random_uuid()), 8) & 63) | 128
  );
  RETURN encode(uuid_bytes, 'hex')::uuid;
END
$$ LANGUAGE plpgsql VOLATILE;

-- ============================================
-- TABLAS
-- ============================================

-- Formularios de contacto
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  name        text NOT NULL,
  email       text NOT NULL,
  company     text,
  phone       text,
  message     text NOT NULL,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);

-- Rate limit persistente (opcional, para producción con múltiples instancias)
CREATE TABLE IF NOT EXISTS rate_limit_entries (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v7(),
  key         text NOT NULL,
  count       integer DEFAULT 1,
  reset_at    timestamptz NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limit_key ON rate_limit_entries(key);
CREATE INDEX IF NOT EXISTS idx_rate_limit_reset ON rate_limit_entries(reset_at);
