import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions, talentProjects } from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { AdminTable } from "@/components/studio/talent/admin/AdminTable";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: "rgba(217,180,120,0.15)", color: "#d9b478", label: "Pendiente" },
  confirmed: { bg: "rgba(34,197,94,0.15)", color: "#7dd3a3", label: "Confirmado" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", label: "Rechazado" },
};

export default async function AdminSubmissionsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  const base = `/${locale}/studio/talent/admin`;

  const baseQuery = db
    .select({
      id: castingSubmissions.id,
      projectSlug: castingSubmissions.projectSlug,
      projectName: talentProjects.name,
      client: talentProjects.client,
      userEmail: castingSubmissions.userEmail,
      shortlistLen: castingSubmissions.shortlist,
      exclusivesLen: castingSubmissions.exclusives,
      status: castingSubmissions.status,
      submittedAt: castingSubmissions.submittedAt,
    })
    .from(castingSubmissions)
    .innerJoin(
      talentProjects,
      eq(talentProjects.slug, castingSubmissions.projectSlug)
    )
    .orderBy(desc(castingSubmissions.submittedAt));

  const rows = status
    ? await baseQuery.where(eq(castingSubmissions.status, status))
    : await baseQuery;

  const tableRows = rows.map((r) => ({
    id: r.id,
    project: `${r.projectName} (${r.client})`,
    email: r.userEmail,
    counts: `${r.shortlistLen.length} · ${r.exclusivesLen.length} excl.`,
    status: r.status,
    submittedAt: r.submittedAt,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Selecciones recibidas"
        title="Submissions"
        description={`${rows.length} submission(s)${status ? ` con status "${status}"` : ""}.`}
        backHref={base}
        backLabel="← Volver al admin"
      />

      <div className="mb-5 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
        <FilterChip
          href={`${base}/submissions`}
          active={!status}
          label="Todas"
        />
        {(["pending", "confirmed", "rejected"] as const).map((s) => (
          <FilterChip
            key={s}
            href={`${base}/submissions?status=${s}`}
            active={status === s}
            label={STATUS_STYLES[s]?.label ?? s}
          />
        ))}
      </div>

      <AdminTable
        rows={tableRows}
        rowHref={(r) => `${base}/submissions/${r.id}`}
        columns={[
          {
            header: "Recibido",
            cell: (r) => (
              <span className="font-mono text-[11px] text-white/70">
                {formatRelative(r.submittedAt)}
              </span>
            ),
          },
          { header: "Proyecto", cell: (r) => r.project },
          { header: "Cliente email", cell: (r) => r.email },
          { header: "Selección", cell: (r) => r.counts },
          {
            header: "Status",
            cell: (r) => {
              const s = STATUS_STYLES[r.status] ?? {
                bg: "rgba(255,255,255,0.05)",
                color: "#fff",
                label: r.status,
              };
              return (
                <span
                  className="inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
              );
            },
          },
        ]}
        emptyMessage="No hay submissions con ese filtro."
      />
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <a
      href={href}
      className={`px-3 py-1.5 transition-colors ${
        active
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "border border-white/[0.08] text-white/55 hover:border-white/30 hover:text-white"
      }`}
    >
      {label}
    </a>
  );
}

function formatRelative(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const ms = Date.now() - date.getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `hace ${day} d`;
  return date.toLocaleDateString("es-CL");
}
