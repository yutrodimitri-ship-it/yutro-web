"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="max-w-md text-center px-6">
          <h1 className="text-5xl font-bold">Error</h1>
          <p className="mt-4 text-lg text-neutral-400">
            Algo salió mal. Por favor intenta de nuevo.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-neutral-600">Ref: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="mt-8 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
