"use client";

import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <h1 className="text-6xl font-bold text-primary">Error</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Algo salió mal. Por favor intenta de nuevo.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground/60">
            Ref: {error.digest}
          </p>
        )}
        <Button onClick={reset} className="mt-8">
          Intentar de nuevo
        </Button>
      </Container>
    </section>
  );
}
