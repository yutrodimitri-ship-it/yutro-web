/**
 * Pure logic for the per-user project-access set replacement.
 *
 * Given the user's current access rows (some active, some soft-revoked) and a
 * target set of project slugs, decide which rows to create new, which existing
 * revoked rows to reactivate, and which currently-active rows to revoke.
 *
 * Extracted from PATCH /api/studio/admin/users/[id]/access for unit testing.
 *
 * Invariants the caller can rely on:
 *   - `toCreate`, `toReactivate.projectSlug`, and `toRevoke` are pairwise
 *     disjoint — no slug appears in more than one bucket.
 *   - Returns slugs that EXIST in the target set as either toCreate or
 *     toReactivate, never both (a row is reactivated iff it pre-existed in
 *     a revoked state).
 *   - Slugs duplicated in `target` are deduplicated.
 *   - A slug present in `existing` multiple times (data quirk) reactivates
 *     only one row (the first found, stable insertion order).
 */
export interface AccessRow {
  id: string;
  projectSlug: string;
  revokedAt: Date | null;
}

export interface AccessDiff<TRow extends AccessRow = AccessRow> {
  /** Slugs the user has no row for at all — must INSERT. */
  toCreate: string[];
  /** Existing rows that are currently revoked and should be reactivated. */
  toReactivate: TRow[];
  /** Currently-active slugs not in target — soft-revoke. */
  toRevoke: string[];
}

export function diffAccessChanges<TRow extends AccessRow>(
  existing: readonly TRow[],
  targetSlugs: readonly string[]
): AccessDiff<TRow> {
  const target = new Set(targetSlugs);

  // Index existing rows by slug; if a slug appears twice (unexpected),
  // keep the first encountered to make the operation deterministic.
  const existingBySlug = new Map<string, TRow>();
  for (const row of existing) {
    if (!existingBySlug.has(row.projectSlug)) {
      existingBySlug.set(row.projectSlug, row);
    }
  }

  const activeSlugs = new Set(
    existing.filter((r) => r.revokedAt === null).map((r) => r.projectSlug)
  );

  const toCreate: string[] = [];
  const toReactivate: TRow[] = [];
  for (const slug of target) {
    const row = existingBySlug.get(slug);
    if (!row) {
      toCreate.push(slug);
    } else if (row.revokedAt !== null) {
      toReactivate.push(row);
    }
    // else: row exists and is active — nothing to do
  }

  const toRevoke: string[] = [];
  for (const slug of activeSlugs) {
    if (!target.has(slug)) toRevoke.push(slug);
  }

  return { toCreate, toReactivate, toRevoke };
}
