"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  INDUSTRY_CATEGORIES,
  PROJECT_STATUSES,
  RIGHTS_DURATION_OPTIONS,
} from "@/lib/talent/admin-schemas";

export interface ProjectFormValues {
  slug: string;
  name: string;
  client: string;
  market: string;
  categoryEs: string;
  maxTalents: number;
  maxExclusive: number;
  rightsDurationMonths: number;
  startDate: string; // yyyy-mm-dd
  status: (typeof PROJECT_STATUSES)[number];
}

interface ProjectFormProps {
  initial: ProjectFormValues;
  mode: "create" | "edit";
  onCancelHref: string;
}

export function ProjectForm({
  initial,
  mode,
  onCancelHref,
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
          <Field label="Categoría">
            <select
              value={values.categoryEs}
              onChange={(e) => update("categoryEs", e.target.value)}
              className={inputClass}
              required
            >
              <option value="">— seleccionar —</option>
              {INDUSTRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
          <Field label="Duración derechos">
            <select
              value={values.rightsDurationMonths}
              onChange={(e) => update("rightsDurationMonths", Number(e.target.value))}
              className={inputClass}
              required
            >
              {RIGHTS_DURATION_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m} meses
                </option>
              ))}
            </select>
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
