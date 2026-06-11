#!/usr/bin/env bash
# Smoke test post-deploy. Corre contra production o preview.
#
# Uso:
#   SMOKE_BASE=https://www.yutro.cl ./scripts/smoke-test.sh
#   SMOKE_BASE=https://yutro-web-preview.vercel.app ./scripts/smoke-test.sh
#
# Falla con exit 1 si alguno de los checks falla — usar como gate antes
# de promover deploy a production.

set -euo pipefail

BASE="${SMOKE_BASE:-https://www.yutro.cl}"
echo "→ Smoke testing $BASE"

fail() {
  echo "✗ $1"
  exit 1
}

ok() {
  echo "✓ $1"
}

# 1. Login page accesible (200)
status="$(curl -s -o /dev/null -w "%{http_code}" "$BASE/es/studio/login")"
[ "$status" = "200" ] || fail "login page returned $status"
ok "login page (200)"

# 2. Hub redirige sin sesion (3xx)
status="$(curl -s -o /dev/null -w "%{http_code}" "$BASE/es/studio")"
case "$status" in
  3*) ok "hub redirect ($status)" ;;
  *) fail "hub didn't redirect, got $status" ;;
esac

# 3. API audit requiere auth (401)
status="$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/studio/talent/audit" \
  -H "Content-Type: application/json" -d '{}')"
[ "$status" = "401" ] || fail "audit API returned $status (expected 401)"
ok "audit API auth gate (401)"

# 4. API casting requiere auth (401)
status="$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/studio/talent/castings" \
  -H "Content-Type: application/json" -d '{}')"
[ "$status" = "401" ] || fail "castings API returned $status (expected 401)"
ok "castings API auth gate (401)"

# 5. API project requiere auth (401)
status="$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/studio/talent/projects/samsung-galaxy-q1-2026")"
[ "$status" = "401" ] || fail "projects API returned $status (expected 401)"
ok "projects API auth gate (401)"

# 6. Public assets cargan
curl -sf "$BASE/favicon.ico" -o /dev/null && ok "favicon.ico" || fail "favicon"

# 7. Sitemap (si existe)
if curl -sf "$BASE/sitemap.xml" -o /dev/null; then
  ok "sitemap.xml"
fi

echo "→ All smoke tests passed"
