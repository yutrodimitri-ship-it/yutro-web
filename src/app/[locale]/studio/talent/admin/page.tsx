import Link from "next/link";
import { ClipboardList, Layers, Users } from "lucide-react";
import { count, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { db } from "@/db";
import {
  castingSubmissions,
  talentProjects,
  talents,
} from "@/db/schema";

export default async function TalentAdminHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studio.talent.admin.hub" });

  const [talentsCount, projectsCount, pendingCount] = await Promise.all([
    db
      .select({ n: count() })
      .from(talents)
      .where(eq(talents.isActive, true))
      .then((rows) => rows[0]?.n ?? 0),
    db
      .select({ n: count() })
      .from(talentProjects)
      .where(eq(talentProjects.status, "active"))
      .then((rows) => rows[0]?.n ?? 0),
    db
      .select({ n: count() })
      .from(castingSubmissions)
      .where(eq(castingSubmissions.status, "pending"))
      .then((rows) => rows[0]?.n ?? 0),
  ]);

  const base = `/${locale}/studio/talent/admin`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="mb-12 sm:mb-16">
        <p
          className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          Yutro Studio · Admin
        </p>
        <h1
          className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
          {t("subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <AdminCard
          href={`${base}/talents`}
          title={t("talents.title")}
          subtitle={t("talents.count", { count: talentsCount })}
          icon={<Users className="h-6 w-6" strokeWidth={1.5} />}
        />
        <AdminCard
          href={`${base}/projects`}
          title={t("projects.title")}
          subtitle={t("projects.count", { count: projectsCount })}
          icon={<Layers className="h-6 w-6" strokeWidth={1.5} />}
        />
        <AdminCard
          href={`${base}/submissions`}
          title={t("submissions.title")}
          subtitle={t("submissions.count", { count: pendingCount })}
          icon={<ClipboardList className="h-6 w-6" strokeWidth={1.5} />}
        />
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 border border-white/[0.08] bg-[#131313] p-6 transition-colors hover:border-[var(--accent)]/40 hover:bg-[#181818]"
    >
      <div className="text-[var(--accent)]">{icon}</div>
      <div>
        <h2
          className="mb-1 text-xl text-white"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
        >
          {title}
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
