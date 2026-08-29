import { notFound } from "next/navigation";

/**
 * Catch-all para rutas sin match dentro del árbol [locale].
 *
 * Sin esto, una URL desconocida (/es/lo-que-sea) renderiza el 404
 * genérico de Next en vez de nuestro not-found.tsx con links de
 * recuperación (secciones, sitemap.xml, llms.txt). Patrón recomendado
 * por next-intl para que el 404 pase por el layout del locale.
 */
export default function CatchAllPage() {
  notFound();
}
