import { getMarkdownForPath } from "@/lib/agent-markdown";

/**
 * Endpoint de markdown para agentes (acceptmarkdown.com).
 *
 * El middleware reescribe acá cualquier ruta pública pedida con
 * `Accept: text/markdown`. También responde directo en /md/<ruta>
 * para debugging. Rutas desconocidas devuelven 404 con un cuerpo
 * markdown de recuperación (mapa del sitio, llms.txt).
 */

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const pathname = "/" + (slug ?? []).join("/");
  const { markdown, status } = getMarkdownForPath(pathname);

  return new Response(markdown, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      // La variante markdown no debe competir con el HTML en los índices
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
