import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <h1 className="text-7xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Página no encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-8">
          <CTAButton href="/">Volver al inicio</CTAButton>
        </div>
      </Container>
    </section>
  );
}
