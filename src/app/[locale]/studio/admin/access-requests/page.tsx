import { desc } from "drizzle-orm";
import { db } from "@/db";
import { accessRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { FIELD_LABELS } from "@/lib/access-request/schema";

export const dynamic = "force-dynamic";

/**
 * /studio/admin/access-requests — tabla simple read-only de leads que
 * llegaron via /casting/solicitar-acceso. Para iterar status hay que
 * ir a SQL por ahora; el admin UI completo (cambiar status, filtrar,
 * etc) queda pendiente.
 */
export default async function AccessRequestsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await requireAdmin();
  const { locale: rawLocale } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";

  const rows = await db
    .select()
    .from(accessRequests)
    .orderBy(desc(accessRequests.createdAt))
    .limit(200);

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="mb-8 flex items-end justify-between border-b border-foreground/10 pb-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            Admin · Casting
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-0.025em" }}>
            {locale === "es" ? "Solicitudes de acceso" : "Access requests"}
          </h1>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          {rows.length} {locale === "es" ? "totales" : "total"}
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-foreground/15 px-6 py-16 text-center">
          <p className="text-foreground/50 italic">
            {locale === "es"
              ? "Sin solicitudes todavía."
              : "No requests yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <Th>{locale === "es" ? "Fecha" : "Date"}</Th>
                <Th>{locale === "es" ? "Empresa" : "Company"}</Th>
                <Th>{locale === "es" ? "Nombre" : "Name"}</Th>
                <Th>{locale === "es" ? "Proyecto" : "Project"}</Th>
                <Th>{locale === "es" ? "Plazo" : "Timeline"}</Th>
                <Th>{locale === "es" ? "Presupuesto" : "Budget"}</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-foreground/5 hover:bg-foreground/[0.02]"
                >
                  <Td className="font-mono text-[11px] text-foreground/55">
                    {new Date(r.createdAt).toLocaleDateString(locale === "es" ? "es-CL" : "en-US")}
                  </Td>
                  <Td>
                    <p className="font-semibold">{r.company}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                      {r.country ?? "—"}
                    </p>
                  </Td>
                  <Td>
                    <p>{r.name}</p>
                    <a
                      href={`mailto:${r.email}`}
                      className="font-mono text-[11px] text-foreground/50 hover:text-primary"
                    >
                      {r.email}
                    </a>
                    {r.role && (
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                        {r.role}
                      </p>
                    )}
                  </Td>
                  <Td className="text-[13px]">
                    {r.projectType
                      ? FIELD_LABELS.projectType[locale][
                          r.projectType as keyof (typeof FIELD_LABELS.projectType)["es"]
                        ] ?? r.projectType
                      : "—"}
                  </Td>
                  <Td className="text-[13px]">
                    {r.timeline
                      ? FIELD_LABELS.timeline[locale][
                          r.timeline as keyof (typeof FIELD_LABELS.timeline)["es"]
                        ] ?? r.timeline
                      : "—"}
                  </Td>
                  <Td className="text-[13px]">
                    {r.budgetRange
                      ? FIELD_LABELS.budgetRange[locale][
                          r.budgetRange as keyof (typeof FIELD_LABELS.budgetRange)["es"]
                        ] ?? r.budgetRange
                      : "—"}
                  </Td>
                  <Td>
                    <StatusBadge status={r.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/35">
        {locale === "es"
          ? "Cambio de status manual via SQL por ahora — admin UI completo en backlog."
          : "Status changes via SQL for now — full admin UI in backlog."}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-4 align-top ${className}`}>{children}</td>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "pending"
      ? "bg-foreground/10 text-foreground/70"
      : status === "contacted"
      ? "bg-blue-500/15 text-blue-500"
      : status === "qualified"
      ? "bg-primary/15 text-primary"
      : status === "converted"
      ? "bg-emerald-500/15 text-emerald-500"
      : "bg-foreground/5 text-foreground/40 line-through";
  return (
    <span className={`inline-flex items-center px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${tone}`}>
      {status}
    </span>
  );
}
