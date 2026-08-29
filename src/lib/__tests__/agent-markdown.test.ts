import { describe, it, expect } from "vitest";
import { wantsMarkdown, getMarkdownForPath } from "../agent-markdown";

describe("wantsMarkdown", () => {
  it("detecta text/markdown en el header Accept", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/html;q=0.9")).toBe(true);
    expect(wantsMarkdown("application/json, text/markdown;q=0.8")).toBe(true);
    expect(wantsMarkdown("TEXT/MARKDOWN")).toBe(true);
  });

  it("no matchea HTML ni wildcards ni null", () => {
    expect(wantsMarkdown("text/html,application/xhtml+xml")).toBe(false);
    expect(wantsMarkdown("*/*")).toBe(false);
    expect(wantsMarkdown(null)).toBe(false);
    expect(wantsMarkdown("")).toBe(false);
  });
});

describe("getMarkdownForPath — páginas conocidas", () => {
  it("home ES: H1, contenido suficiente y links de navegación", () => {
    const { markdown, status } = getMarkdownForPath("/");
    expect(status).toBe(200);
    expect(markdown).toMatch(/^# YUTRO\./);
    expect(markdown.length).toBeGreaterThan(500);
    expect(markdown).toContain("/es/proyectos");
    expect(markdown).toContain("llms.txt");
  });

  it("home EN via /en", () => {
    const { markdown, status } = getMarkdownForPath("/en");
    expect(status).toBe(200);
    expect(markdown).toContain("We create with AI");
    expect(markdown).toContain("/en/proyectos");
  });

  it("detalle de proyecto existente con cliente y videos", () => {
    const { markdown, status } = getMarkdownForPath("/es/proyectos/latam-pass");
    expect(status).toBe(200);
    expect(markdown).toMatch(/^# LATAM Pass/);
    expect(markdown).toContain("**Cliente:** LATAM Airlines");
    expect(markdown).toContain("youtube.com/embed/");
  });

  it("índice de proyectos lista todos los casos", () => {
    const { markdown, status } = getMarkdownForPath("/es/proyectos");
    expect(status).toBe(200);
    expect(markdown).toContain("latam-pass");
    expect(markdown).toContain("super-pollo");
  });

  it("privacidad, estudio y contacto responden en ambos idiomas", () => {
    for (const path of [
      "/es/privacidad",
      "/en/privacidad",
      "/es/estudio",
      "/en/estudio",
      "/es/contacto",
      "/en/contacto",
    ]) {
      const { status, markdown } = getMarkdownForPath(path);
      expect(status, path).toBe(200);
      expect(markdown.length, path).toBeGreaterThan(300);
    }
  });

  it("aliases en inglés (/about, /privacy, /contact) resuelven", () => {
    expect(getMarkdownForPath("/en/about").status).toBe(200);
    expect(getMarkdownForPath("/en/privacy").status).toBe(200);
    expect(getMarkdownForPath("/en/contact").status).toBe(200);
  });
});

describe("getMarkdownForPath — 404", () => {
  it("ruta desconocida devuelve 404 con cuerpo de recuperación", () => {
    const { markdown, status } = getMarkdownForPath("/es/no-existe-xyz");
    expect(status).toBe(404);
    expect(markdown).toContain("# 404");
    expect(markdown).toContain("llms.txt");
    expect(markdown).toContain("sitemap.xml");
    expect(markdown).toContain("/es/proyectos");
  });

  it("proyecto inexistente devuelve 404", () => {
    expect(getMarkdownForPath("/es/proyectos/no-existe").status).toBe(404);
  });
});

describe("paridad con el middleware", () => {
  // src/proxy.ts define acceptsMarkdown() inline con el MISMO regex
  // (no importa esta lib para no arrastrar los datos al bundle edge).
  // Este test fija el contrato: si cambias el regex acá, cámbialo allá.
  it("el regex del contrato es /\\btext\\/markdown\\b/i", () => {
    const contract = /\btext\/markdown\b/i;
    for (const sample of [
      "text/markdown",
      "text/html, text/markdown;q=0.5",
      "text/html",
      "*/*",
    ]) {
      expect(wantsMarkdown(sample)).toBe(contract.test(sample));
    }
  });
});
