"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/data/contact";
import { contactSchema } from "@/lib/validation";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchCsrf = useCallback(async () => {
    try {
      const res = await fetch("/api/csrf");
      if (res.ok) {
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      }
    } catch {
      // Silent fail — will be caught at submit time
    }
  }, []);

  useEffect(() => {
    fetchCsrf();
  }, [fetchCsrf]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // Client-side validation
    const validation = contactSchema.safeParse(raw);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = String(issue.path[0]);
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(validation.data),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => null);
        setErrorMsg(data?.error || t("error"));
        setStatus("error");
        // Refresh CSRF token after failure
        fetchCsrf();
      }
    } catch {
      setErrorMsg(t("error"));
      setStatus("error");
      fetchCsrf();
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-5xl">
        <SectionHeader title={t("title")} />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <FadeInOnScroll>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  {t("name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  disabled={status === "sending" || status === "success"}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  {t("email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={status === "sending" || status === "success"}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  {t("phone")}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  disabled={status === "sending" || status === "success"}
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                  {t("subject")}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  disabled={status === "sending" || status === "success"}
                  aria-invalid={!!fieldErrors.subject}
                  aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                />
                {fieldErrors.subject && (
                  <p id="subject-error" className="mt-1 text-xs text-destructive">{fieldErrors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  {t("message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  disabled={status === "sending" || status === "success"}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? "message-error" : undefined}
                />
                {fieldErrors.message && (
                  <p id="message-error" className="mt-1 text-xs text-destructive">{fieldErrors.message}</p>
                )}
              </div>

              {/* Honeypot — hidden from users, bots fill it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === "sending" || status === "success"}
              >
                {status === "sending" ? t("sending") : t("send")}
              </Button>

              {status === "success" && (
                <p className="text-sm text-green-600 dark:text-green-400" role="alert">
                  {t("success")}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive" role="alert">
                  {errorMsg || t("error")}
                </p>
              )}
            </form>
          </FadeInOnScroll>

          {/* Contact Info */}
          <FadeInOnScroll direction="right">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold">Email</h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="mt-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Teléfono</h3>
                <ul className="mt-1 space-y-1">
                  {contactInfo.phones.map((phone) => (
                    <li key={phone.number}>
                      <a
                        href={`tel:${phone.number.replace(/\s/g, "")}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {phone.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Instagram</h3>
                <a
                  href={contactInfo.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  {contactInfo.instagram.handle}
                </a>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{contactInfo.company.name}</strong>
                  <br />
                  {contactInfo.company.parent}
                </p>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}
