"use client";

import { useState, useTransition } from "react";
import {
  accessRequestSchema,
  type AccessRequestInput,
} from "@/lib/access-request/schema";

interface AccessRequestFormProps {
  locale: "es" | "en";
  labels: FormLabels;
}

export interface FormLabels {
  name: string;
  email: string;
  emailHint: string;
  notes: string;
  notesHint: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  back: string;
  errorRateLimit: string;
  errorGeneric: string;
}

const RATE_LIMIT_CLIENT_MS = 60_000; // 1 min
const RATE_LIMIT_KEY = "yutro:access-request:last-submit";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; id: string }
  | { status: "error"; message: string; field?: keyof AccessRequestInput };

export function AccessRequestForm({ locale, labels }: AccessRequestFormProps) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Partial<Record<keyof AccessRequestInput, string>>>(
    {}
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "submitting") return;

    // Rate-limit cliente
    try {
      const last = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? "0");
      if (last && Date.now() - last < RATE_LIMIT_CLIENT_MS) {
        setState({
          status: "error",
          message: labels.errorRateLimit,
        });
        return;
      }
    } catch {
      // localStorage no disponible (incognito strict, etc) — seguir
    }

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
    };

    const parsed = accessRequestSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof AccessRequestInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AccessRequestInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setState({
        status: "error",
        message: parsed.error.issues[0]?.message ?? labels.errorGeneric,
      });
      return;
    }

    setErrors({});
    setState({ status: "submitting" });

    startTransition(async () => {
      try {
        const res = await fetch(`/api/access-request?locale=${locale}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          id?: string;
          error?: string;
        } | null;
        if (res.status === 429) {
          setState({ status: "error", message: labels.errorRateLimit });
          return;
        }
        if (!res.ok || !json?.ok) {
          setState({ status: "error", message: labels.errorGeneric });
          return;
        }
        try {
          localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
        } catch {
          // ignore
        }
        setState({ status: "success", id: json.id ?? "" });
      } catch {
        setState({ status: "error", message: labels.errorGeneric });
      }
    });
  }

  if (state.status === "success") {
    return <SuccessPanel labels={labels} locale={locale} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      {/* Honeypot — escondido visualmente y al lector de pantalla */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-10000px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* Nombre + Email en grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={labels.name} error={errors.name} required>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className={fieldClass(errors.name)}
          />
        </Field>
        <Field
          label={labels.email}
          error={errors.email}
          hint={labels.emailHint}
          required
        >
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={fieldClass(errors.email)}
          />
        </Field>
      </div>

      {/* Notas */}
      <Field label={labels.notes} hint={labels.notesHint}>
        <textarea
          name="notes"
          rows={4}
          maxLength={500}
          className={`${fieldClass(undefined)} resize-y`}
        />
      </Field>

      {/* Submit */}
      <div className="flex flex-col items-start gap-3 pt-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="group inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.status === "submitting" && (
            <Spinner />
          )}
          {state.status === "submitting" ? labels.submitting : labels.submit}
          {state.status !== "submitting" && (
            <span className="transition-transform group-hover:translate-x-1">→</span>
          )}
        </button>
        {state.status === "error" && (
          <p className="text-sm text-primary" role="alert">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/55">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-primary">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-foreground/40">{hint}</span>
      ) : null}
    </label>
  );
}

function fieldClass(error: string | undefined) {
  return `block w-full border bg-background px-3 py-3 text-base text-foreground transition-colors focus:outline-none focus:border-primary ${
    error ? "border-primary/60" : "border-foreground/15"
  }`;
}

function Spinner() {
  return (
    <span
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden
    />
  );
}

function SuccessPanel({
  labels,
  locale,
}: {
  labels: FormLabels;
  locale: "es" | "en";
}) {
  return (
    <div className="border border-foreground/15 p-8 sm:p-12">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
        {locale === "es" ? "Recibida" : "Received"}
      </p>
      <h2
        className="font-heading font-extrabold leading-[0.95]"
        style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em" }}
      >
        {labels.successTitle}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-foreground/65 sm:text-lg" style={{ maxWidth: "48ch" }}>
        {labels.successBody}
      </p>
      <a
        href={`/${locale}/casting`}
        className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:underline"
      >
        ← {labels.back}
      </a>
    </div>
  );
}
