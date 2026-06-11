import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getAllActiveProjects, getProjectsForUser } from "@/lib/talent/data-source";

export default async function TalentRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();
  if (!session) redirect(`/${locale}/studio/login`);

  const isAdmin = session.role === "admin";
  // Admin ve todos los proyectos activos; cliente solo los asignados a su email.
  const projects = isAdmin
    ? await getAllActiveProjects()
    : await getProjectsForUser(session.email);

  if (projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <p
          className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/30"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          Catálogo Talent
        </p>
        <h1
          className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isAdmin ? "Sin proyectos activos" : "Sin proyectos activos"}
        </h1>
        <p className="text-[15px] leading-relaxed text-white/50">
          {isAdmin
            ? "Aún no hay proyectos activos en el sistema. Crea uno desde Talent Admin."
            : "No tienes proyectos Talent asignados en este momento. Contacta a tu ejecutivo Yutro para activar el acceso."}
        </p>
      </div>
    );
  }

  // Solo el cliente con 1 proyecto pasa directo. El admin siempre ve el selector.
  if (!isAdmin && projects.length === 1) {
    redirect(`/${locale}/studio/talent/${projects[0].slug}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/30"
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {isAdmin ? "Catálogo · Vista admin" : "Yutro Estudio — Casting House"}
      </p>
      <h1
        className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.025em" }}
      >
        Selecciona un proyecto
      </h1>
      <p className="mb-10 text-[14px] leading-relaxed text-white/50">
        {isAdmin
          ? `${projects.length} proyectos activos en el sistema.`
          : `Tienes acceso a ${projects.length} proyectos activos.`}
      </p>

      <div className="flex flex-col gap-px bg-[#1e1e1e]">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/${locale}/studio/talent/${p.slug}`}
            className="group flex items-center justify-between gap-6 bg-[#141414] px-5 py-5 transition-colors hover:bg-[#1a1a1a]"
          >
            <div className="min-w-0 flex-1">
              <p
                className="mb-0.5 truncate text-[16px] font-semibold tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {p.name}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30"
              >
                {p.client} · {p.market}
              </p>
            </div>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30 transition-colors group-hover:text-[var(--accent)]"
            >
              Entrar →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
