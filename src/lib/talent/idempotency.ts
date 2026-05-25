import { createHash } from "node:crypto";

/**
 * Hash deterministico para detectar re-submits dentro del mismo minuto.
 *
 * Si el cliente clickea "Confirmar" 2 veces rapido, el segundo POST recibe
 * 200 con el mismo `submissionId` del primero (ver `castingSubmissions.idempotencyKey`
 * unique index en schema.ts).
 *
 * La resolucion al minuto es deliberada: re-submits genuinos (cliente cambia
 * de opinion 5 minutos despues) deben crear un nuevo registro.
 */
export function castingIdempotencyKey(
  projectSlug: string,
  shortlist: string[],
  exclusives: string[],
  timestamp = Date.now()
): string {
  const minute = Math.floor(timestamp / 60_000);
  const sortedShortlist = [...shortlist].sort().join(",");
  const sortedExclusives = [...exclusives].sort().join(",");
  return createHash("sha256")
    .update(`${projectSlug}|${sortedShortlist}|${sortedExclusives}|${minute}`)
    .digest("hex")
    .slice(0, 32);
}
