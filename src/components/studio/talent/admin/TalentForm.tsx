"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Portrait } from "../Portrait";
import {
  TALENT_AGE_BUCKETS,
  TALENT_CATEGORIES,
  TALENT_GENDERS,
  TALENT_STATUSES,
} from "@/lib/talent/admin-schemas";

export interface TalentFormValues {
  code: string;
  nameEs: string;
  nameEn: string;
  shortDescEs: string;
  shortDescEn: string;
  gender: "m" | "f";
  ageRange: string;
  ageBucket: (typeof TALENT_AGE_BUCKETS)[number];
  phenotypeEs: string;
  phenotypeEn: string;
  archetypeEs: string;
  archetypeEn: string;
  category: (typeof TALENT_CATEGORIES)[number];
  toneCommercialEs: string;
  toneCommercialEn: string;
  bioEs: string;
  bioEn: string;
  market: string[];
  suggestedUses: { es: string; en: string }[];
  status: (typeof TALENT_STATUSES)[number];
  hue: number;
  sat: number;
  editorialScore: number;
  isActive: boolean;
}

interface TalentFormProps {
  initial: TalentFormValues;
  mode: "create" | "edit";
  onCancelHref: string;
}

const EMPTY_USE = { es: "", en: "" };

export function TalentForm({ initial, mode, onCancelHref }: TalentFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TalentFormValues>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TalentFormValues>(
    key: K,
    value: TalentFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      // sanitize empty uses
      suggestedUses: values.suggestedUses.filter((u) => u.es.trim() && u.en.trim()),
      market: values.market.filter((m) => m.trim()),
    };

    const url =
      mode === "create"
        ? "/api/studio/talent/admin/talents"
        : `/api/studio/talent/admin/talents/${values.code}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  function addUse() {
    update("suggestedUses", [...values.suggestedUses, { ...EMPTY_USE }]);
  }
  function removeUse(i: number) {
    update(
      "suggestedUses",
      values.suggestedUses.filter((_, idx) => idx !== i)
    );
  }
  function setUse(i: number, field: "es" | "en", val: string) {
    const next = values.suggestedUses.map((u, idx) =>
      idx === i ? { ...u, [field]: val } : u
    );
    update("suggestedUses", next);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-6">
        {/* Code + Name */}
        <Section title="Identidad">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Código">
              <input
                value={values.code}
                onChange={(e) => update("code", e.target.value.toUpperCase())}
                disabled={mode === "edit"}
                className={inputClass}
                placeholder="YE-W31"
                required
              />
            </Field>
            <Field label="Categoría">
              <select
                value={values.category}
                onChange={(e) =>
                  update(
                    "category",
                    e.target.value as TalentFormValues["category"]
                  )
                }
                className={inputClass}
              >
                {TALENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nombre (ES)">
              <input
                value={values.nameEs}
                onChange={(e) => update("nameEs", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Nombre (EN)">
              <input
                value={values.nameEn}
                onChange={(e) => update("nameEn", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Descripción corta (ES)">
              <input
                value={values.shortDescEs}
                onChange={(e) => update("shortDescEs", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Descripción corta (EN)">
              <input
                value={values.shortDescEn}
                onChange={(e) => update("shortDescEn", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
          </div>
        </Section>

        {/* Demografía */}
        <Section title="Demografía">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Género">
              <select
                value={values.gender}
                onChange={(e) =>
                  update("gender", e.target.value as "m" | "f")
                }
                className={inputClass}
              >
                {TALENT_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g === "m" ? "Hombre" : "Mujer"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rango de edad">
              <input
                value={values.ageRange}
                onChange={(e) => update("ageRange", e.target.value)}
                className={inputClass}
                placeholder="32-38"
                required
              />
            </Field>
            <Field label="Bucket etario">
              <select
                value={values.ageBucket}
                onChange={(e) =>
                  update(
                    "ageBucket",
                    e.target.value as TalentFormValues["ageBucket"]
                  )
                }
                className={inputClass}
              >
                {TALENT_AGE_BUCKETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fenotipo (ES)">
              <input
                value={values.phenotypeEs}
                onChange={(e) => update("phenotypeEs", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Fenotipo (EN)">
              <input
                value={values.phenotypeEn}
                onChange={(e) => update("phenotypeEn", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Status">
              <select
                value={values.status}
                onChange={(e) =>
                  update(
                    "status",
                    e.target.value as TalentFormValues["status"]
                  )
                }
                className={inputClass}
              >
                {TALENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Posicionamiento */}
        <Section title="Posicionamiento">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Arquetipo (ES)">
              <input
                value={values.archetypeEs}
                onChange={(e) => update("archetypeEs", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Arquetipo (EN)">
              <input
                value={values.archetypeEn}
                onChange={(e) => update("archetypeEn", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Tono comercial (ES)">
              <input
                value={values.toneCommercialEs}
                onChange={(e) => update("toneCommercialEs", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Tono comercial (EN)">
              <input
                value={values.toneCommercialEn}
                onChange={(e) => update("toneCommercialEn", e.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Bio (ES) — texto narrativo">
              <textarea
                value={values.bioEs}
                onChange={(e) => update("bioEs", e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="Personalidad, antecedentes, contexto cultural, signatura visual…"
                maxLength={2000}
              />
            </Field>
            <Field label="Bio (EN)">
              <textarea
                value={values.bioEn}
                onChange={(e) => update("bioEn", e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                placeholder="Personality, background, cultural context, visual signature…"
                maxLength={2000}
              />
            </Field>
            <Field label="Mercado (CSV: CL,LATAM,US)">
              <input
                value={values.market.join(",")}
                onChange={(e) =>
                  update(
                    "market",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim().toUpperCase())
                      .filter(Boolean)
                  )
                }
                className={inputClass}
                placeholder="CL,LATAM"
                required
              />
            </Field>
          </div>
        </Section>

        {/* Suggested uses */}
        <Section title="Usos sugeridos">
          <div className="space-y-3">
            {values.suggestedUses.map((use, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3">
                <input
                  value={use.es}
                  onChange={(e) => setUse(i, "es", e.target.value)}
                  className={inputClass}
                  placeholder="Uso ES"
                />
                <input
                  value={use.en}
                  onChange={(e) => setUse(i, "en", e.target.value)}
                  className={inputClass}
                  placeholder="Use EN"
                />
                <button
                  type="button"
                  onClick={() => removeUse(i)}
                  className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 hover:text-white"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addUse}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--accent)] hover:opacity-80"
            >
              + Agregar uso
            </button>
          </div>
        </Section>

        {/* Visual */}
        <Section title="Visual placeholder">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`Hue (0-360): ${values.hue}`}>
              <input
                type="range"
                min={0}
                max={360}
                value={values.hue}
                onChange={(e) => update("hue", Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label={`Saturación (0-100): ${values.sat}`}>
              <input
                type="range"
                min={0}
                max={100}
                value={values.sat}
                onChange={(e) => update("sat", Number(e.target.value))}
                className="w-full"
              />
            </Field>
            <Field label={`Score editorial (0-5): ${values.editorialScore}`}>
              <input
                type="range"
                min={0}
                max={5}
                value={values.editorialScore}
                onChange={(e) => update("editorialScore", Number(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 font-mono text-[10px] text-white/30">
                4 o 5 = ancla del catálogo (aparece en posiciones destacadas).
              </p>
            </Field>
          </div>
        </Section>

        {/* Active toggle */}
        <Section title="Visibilidad">
          <label className="inline-flex items-center gap-3 text-[13px] text-white/80">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
            />
            Activo (visible en el catálogo del cliente)
          </label>
        </Section>

        {/* Errors + Actions */}
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
            {mode === "create" ? "Crear talento" : "Guardar cambios"}
          </button>
          <a
            href={onCancelHref}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 hover:text-white"
          >
            Cancelar
          </a>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-12">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
          Preview
        </p>
        <div className="aspect-square overflow-hidden border border-white/[0.08]">
          <Portrait
            code={values.code || "YE-X00"}
            hue={values.hue}
            sat={values.sat}
          />
        </div>
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
