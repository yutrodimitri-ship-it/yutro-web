/**
 * Pure logic for releasing a single talent from a confirmed casting submission.
 *
 * Extracted from /api/studio/talent/admin/submissions/[id]/release-talent so it
 * can be unit-tested without spinning up a DB (mirrors the casting-reducer
 * pattern).
 *
 * Invariants:
 *   - The talent is removed from both `shortlist` and `exclusives`.
 *   - If the resulting shortlist is empty, the submission MUST be marked as
 *     `rejected` — there is no business meaning to a "confirmed" casting
 *     without any talents.
 *   - Idempotent: releasing a talent that's not in the shortlist returns the
 *     same shortlist / exclusives arrays and never triggers a status change.
 */
export interface SubmissionLockState {
  shortlist: readonly string[];
  exclusives: readonly string[];
}

export interface ReleaseResult {
  shortlist: string[];
  exclusives: string[];
  /** True iff the release emptied the shortlist — caller must mark rejected. */
  castingEmptied: boolean;
  /** True iff the talent was actually in the shortlist (state changed). */
  changed: boolean;
}

export function releaseTalent(
  current: SubmissionLockState,
  talentCode: string
): ReleaseResult {
  const wasPresent = current.shortlist.includes(talentCode);
  const shortlist = current.shortlist.filter((c) => c !== talentCode);
  const exclusives = current.exclusives.filter((c) => c !== talentCode);
  return {
    shortlist,
    exclusives,
    castingEmptied: wasPresent && shortlist.length === 0,
    changed: wasPresent,
  };
}
