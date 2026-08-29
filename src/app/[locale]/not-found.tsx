import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";

const RECOVERY_LINKS = [
  { href: "/es/proyectos", label: "Proyectos" },
  { href: "/es/produccion", label: "Producción" },
  { href: "/es/casting", label: "Casting" },
  { href: "/es/estudio", label: "Estudio" },
  { href: "/es/blog", label: "Blog" },
  { href: "/es/contacto", label: "Contacto" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <h1 className="text-7xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Página no encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          La página que buscas no existe o ha sido movida. Prueba con una de
          estas secciones:
        </p>
        <nav aria-label="Secciones del sitio" className="mt-6">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {RECOVERY_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8">
          <CTAButton href="/">Volver al inicio</CTAButton>
        </div>
        <p className="mt-8 text-xs text-muted-foreground/70">
          ¿Buscas el mapa completo? Revisa{" "}
          <a href="/sitemap.xml" className="underline underline-offset-4 hover:text-primary">
            sitemap.xml
          </a>{" "}
          o la guía para agentes en{" "}
          <a href="/llms.txt" className="underline underline-offset-4 hover:text-primary">
            llms.txt
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
