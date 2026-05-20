import type { Locale, ProjectConfig } from "@/types/talent";

interface ProjectHeaderProps {
  project: ProjectConfig;
  locale: Locale;
  startDateLabel: string;
}

export function ProjectHeader({ project, locale, startDateLabel }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Eyebrow */}
      <p
        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--accent)" }}
      >
        <span
          className="block h-px w-5 shrink-0"
          style={{ background: "var(--accent)" }}
        />
        Casting · {project.client}
      </p>

      {/* Title hero */}
      <h1
        className="text-4xl leading-none sm:text-5xl lg:text-6xl"
        style={{
          color: "var(--talent-ink)",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
        title={project.name}
      >
        {renderItalicLast(project.name)}
      </h1>

      {/* Meta */}
      <p
        className="font-mono text-[12px] uppercase tracking-[0.14em]"
        style={{ color: "var(--talent-ink-mute)" }}
      >
        {startDateLabel}
      </p>
    </div>
  );
}

function renderItalicLast(name: string) {
  const trimmed = name.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return name;
  return (
    <>
      {trimmed.slice(0, i)}{" "}
      <em
        style={{
          fontStyle: "italic",
          fontWeight: 700,
          color: "var(--accent)",
        }}
      >
        {trimmed.slice(i + 1)}
      </em>
    </>
  );
}
