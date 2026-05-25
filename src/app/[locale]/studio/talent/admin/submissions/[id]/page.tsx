import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions, talentProjects, talents } from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { AdminTalentImage } from "@/components/studio/talent/admin/AdminTalentImage";
import { SubmissionActions } from "@/components/studio/talent/admin/SubmissionActions";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const [submission] = await db
    .select()
    .from(castingSubmissions)
    .where(eq(castingSubmissions.id, id))
    .limit(1);
  if (!submission) notFound();

  const [project] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, submission.projectSlug))
    .limit(1);

  const talentRows =
    submission.shortlist.length > 0
      ? await db
          .select()
          .from(talents)
          .where(inArray(talents.code, submission.shortlist))
      : [];

  const exclusiveSet = new Set(submission.exclusives);

  // Preserve order of selection
  const orderedTalents = submission.shortlist
    .map((code) => talentRows.find((t) => t.code === code))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Submission"
        title={project?.name ?? submission.projectSlug}
        description={`${submission.userEmail} · ${submission.shortlist.length} talents · ${submission.exclusives.length} exclusivos`}
        backHref={`${base}/submissions`}
        backLabel="← Volver a submissions"
      />

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Selección */}
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
            Selección del cliente (en orden)
          </p>
          {orderedTalents.length === 0 ? (
            <p className="text-[13px] text-white/40">Sin talents.</p>
          ) : (
            <ul className="space-y-2">
              {orderedTalents.map((t) => {
                const isExclusive = exclusiveSet.has(t.code);
                return (
                  <li
                    key={t.code}
                    className="flex items-center gap-4 border bg-[#131313] p-3"
                    style={{
                      borderColor: isExclusive
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden border border-white/[0.08]">
                      <AdminTalentImage
                        talent={{
                          code: t.code,
                          hue: t.hue,
                          sat: t.sat,
                          imageProfileKey: t.imageProfileKey,
                          imageCharsheetKey: t.imageCharsheetKey,
                          galleryKeys: t.galleryKeys,
                        }}
                        variant="profile"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[11px] text-white/40">
                        {t.code}
                      </p>
                      <p className="text-[14px] text-white">{t.nameEs}</p>
                      <p className="text-[12px] text-white/55">
                        {t.gender === "f" ? "Mujer" : "Hombre"} · {t.ageRange} · {t.category}
                      </p>
                    </div>
                    {isExclusive && (
                      <span
                        className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
                        style={{
                          background: "var(--accent)",
                          color: "var(--accent-foreground)",
                        }}
                      >
                        Exclusivo
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Acciones + metadata */}
        <aside className="space-y-6">
          <div className="border border-white/[0.08] bg-[#131313] p-5 space-y-3 text-[13px]">
            <Row label="Cliente">{project?.client ?? "—"}</Row>
            <Row label="Email">{submission.userEmail}</Row>
            <Row label="Recibido">
              {submission.submittedAt.toLocaleString("es-CL")}
            </Row>
            <Row label="Status actual">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white">
                {submission.status}
              </span>
            </Row>
            <Row label="Email">
              {submission.emailDeliveryStatus ?? "—"}
            </Row>
            <Row label="Idempotency">
              <span className="font-mono text-[10px] text-white/40">
                {submission.idempotencyKey.slice(0, 12)}…
              </span>
            </Row>
          </div>

          <SubmissionActions
            submissionId={submission.id}
            currentStatus={submission.status}
            adminNotes={submission.adminNotes ?? ""}
          />
        </aside>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
        {label}
      </span>
      <span className="text-right text-white/85">{children}</span>
    </div>
  );
}
