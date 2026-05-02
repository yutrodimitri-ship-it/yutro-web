"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  EXCLUSIVITY_MODES,
  PROJECT_STATUSES,
} from "@/lib/talent/admin-schemas";

export interface ProjectFormValues {
  slug: string;
  name: string;
  client: string;
  contactEmail: string;
  contactName: string;
  market: string;
  rightsDurationEs: string;
  rightsDurationEn: string;
  exclusivityMode: (typeof EXCLUSIVITY_MODES)[number];
  exclusivityCategoryEs: string | null;
  exclusivityCategoryEn: string | null;
  exclusivityHelpEs: string;
  exclusivityHelpEn: string;
  maxTalents: number;
  maxExclusive: number;
  startDate: string; // yyyy-mm-dd
  blockedTalentCodes: string[];
  status: (typeof PROJECT_STATUSES)[number];
}

interface ProjectFormProps {
  initial: ProjectFormValues;
  mode: "create" | "edit";
  onCancelHref: string;
  /** Lista de talents activos para el multi-select de blockedTalentCodes. */
  talentOptions: { code: string; name: string }[];
}

export function ProjectForm({
  initial,
  mode,
  onCancelHref,
  talentOptions,
}: ProjectFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectFormValues>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectFormValues>(
    key: K,
    val: ProjectFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function toggleBlocked(code: string) {
    update(
      "blockedTalentCodes",
      values.blockedTalentCodes.includes(code)
        ? values.blockedTalentCodes.filter((c) => c !== code)
        : [...values.blockedTalentCodes, code]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const url =
      mode === "create"
        ? "/api/studio/talent/admin/projects"
        : `/api/studio/talent/admin/projects/${values.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.push(onCancelHref);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <Section title="Identidad">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug">
            <input
              value={values.slug}
              onChange={(e) =>
                update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              disabled={mode === "edit"}
              className={inputClass}
              placeholder="cliente-campana-q1-2026"
              required
            />
          </Field>
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) =>
                update(
                  "status",
                  e.target.value as ProjectFormValues["status"]
                )
              }
              className={inputClass}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Nombre del proyecto">
            <input
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Cliente (agencia/marca)">
            <input
              value={values.client}
              onChange={(e) => update("client", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Contacto: nombre">
            <input
              value={values.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Contacto: email">
            <input
              type="email"
              value={values.contactEmail}
              onChange={(e) =>
                update("contactEmail", e.target.value.toLowerCase())
              }
              className={inputClass}
              required
            />
          </Field>
        </div>
      </Section>

      <Section title="Términos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mercado">
            <input
              value={values.market}
              onChange={(e) => update("market", e.target.value)}
              className={inputClass}
              placeholder="Chile"
              required
            />
          </Field>
          <Field label="Inicio (yyyy-mm-dd)">
            <input
              type="date"
              value={values.startDate}
              onChange={(e) => update("startDate", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Duración derechos (ES)">
            <input
              value={values.rightsDurationEs}
              onChange={(e) => update("rightsDurationEs", e.target.value)}
              className={inputClass}
              placeholder="8 meses"
              required
            />
          </Field>
          <Field label="Duración derechos (EN)">
            <input
              value={values.rightsDurationEn}
              onChange={(e) => update("rightsDurationEn", e.target.value)}
              className={inputClass}
              placeholder="8 months"
              required
            />
          </Field>
          <Field label="Max talents">
            <input
              type="number"
              min={1}
              max={50}
              value={values.maxTalents}
              onChange={(e) => update("maxTalents", Number(e.target.value))}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Max exclusivos">
            <input
              type="number"
              min={0}
              max={50}
              value={values.maxExclusive}
              onChange={(e) => update("maxExclusive", Number(e.target.value))}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </Section>

      <Section title="Exclusividad">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Modo">
            <select
              value={values.exclusivityMode}
              onChange={(e) =>
                update(
                  "exclusivityMode",
                  e.target.value as ProjectFormValues["exclusivityMode"]
                )
              }
              className={inputClass}
            >
              {EXCLUSIVITY_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          {values.exclusivityMode === "category" && (
            <>
              <Field label="Categoría exclusiva (ES)">
                <input
                  value={values.exclusivityCategoryEs ?? ""}
                  onChange={(e) =>
                    update("exclusivityCategoryEs", e.target.value || null)
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Categoría exclusiva (EN)">
                <input
                  value={values.exclusivityCategoryEn ?? ""}
                  onChange={(e) =>
                    update("exclusivityCategoryEn", e.target.value || null)
                  }
                  className={inputClass}
                />
              </Field>
            </>
          )}
          <Field label="Texto ayuda exclusividad (ES)">
            <textarea
              value={values.exclusivityHelpEs}
              onChange={(e) => update("exclusivityHelpEs", e.target.value)}
              className={`${inputClass} min-h-[80px]`}
              required
            />
          </Field>
          <Field label="Texto ayuda exclusividad (EN)">
            <textarea
              value={values.exclusivityHelpEn}
              onChange={(e) => update("exclusivityHelpEn", e.target.value)}
              className={`${inputClass} min-h-[80px]`}
              required
            />
          </Field>
        </div>
      </Section>

      <Section title="Talents bloqueados">
        <p className="mb-3 text-[12px] text-white/55">
          Los talents seleccionados NO aparecerán en el catálogo de este
          proyecto (ya están en otra campaña, en reserva, etc.).
        </p>
        <div className="grid max-h-72 overflow-y-auto border border-white/[0.08] bg-[#0a0a0a] p-3 sm:grid-cols-2 lg:grid-cols-3">
          {talentOptions.map((t) => (
            <label
              key={t.code}
              className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.03]"
            >
              <input
                type="checkbox"
                checked={values.blockedTalentCodes.includes(t.code)}
                onChange={() => toggleBlocked(t.code)}
              />
              <span className="font-mono text-[11px] text-white">{t.code}</span>
              <span className="truncate">— {t.name}</span>
            </label>
          ))}
        </div>
      </Section>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {mode === "create" ? "Crear proyecto" : "Guardar cambios"}
        </button>
        <a
          href={onCancelHref}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 hover:text-white"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-[var(--accent)]/60 focus:outline-none disabled:opacity-50";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] text-white/55">{label}</span>
      {children}
    </label>
  );
}
