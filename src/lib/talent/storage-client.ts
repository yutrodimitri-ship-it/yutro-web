import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de almacenamiento de imagenes de talento — Supabase Storage.
 *
 * Mismo contrato que r2-client.ts (getImageBuffer / uploadImage / deleteImage):
 * se eligio Supabase Storage porque las credenciales ya existen en el proyecto
 * (service role) y el patron de buckets privados ya se usa. Si en el futuro se
 * crea la cuenta Cloudflare R2, basta cambiar los imports de vuelta a
 * r2-client.ts — las keys en BD usan la misma convencion en ambos backends.
 *
 * Bucket privado `talents`: NUNCA se exponen URLs publicas. Las imagenes se
 * sirven via API route protegida (`/api/studio/talent/image/[code]/[variant]`)
 * que valida sesion + ownership y aplica watermark dinamico.
 *
 * Convencion de keys (compartida con R2): `talents/${code}/${variant}.jpg`
 * — en Supabase, `talents` es el bucket y el resto es el path del objeto.
 */

const BUCKET = "talents";

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Storage not configured: set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** `talents/YE-M01/profile.jpg` → path del objeto dentro del bucket. */
function toObjectPath(key: string): string {
  return key.startsWith(`${BUCKET}/`) ? key.slice(BUCKET.length + 1) : key;
}

/** Lee imagen desde Storage y devuelve buffer. Lanza si no existe. */
export async function getImageBuffer(key: string): Promise<Buffer> {
  const { data, error } = await getClient()
    .storage.from(BUCKET)
    .download(toObjectPath(key));
  if (error || !data) {
    // Mensaje compatible con el manejo de 404 de la API route (NotFound)
    throw new Error(`Storage object ${key} NotFound: ${error?.message ?? "empty body"}`);
  }
  return Buffer.from(await data.arrayBuffer());
}

export async function uploadImage(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const { error } = await getClient()
    .storage.from(BUCKET)
    .upload(toObjectPath(key), body, { contentType, upsert: true });
  if (error) throw new Error(`Storage upload failed for ${key}: ${error.message}`);
}

export async function deleteImage(key: string): Promise<void> {
  const { error } = await getClient()
    .storage.from(BUCKET)
    .remove([toObjectPath(key)]);
  if (error) throw new Error(`Storage delete failed for ${key}: ${error.message}`);
}

/**
 * Lista recursivamente todos los objetos bajo un prefijo. `.list()` de Supabase
 * no es recursivo: las carpetas vienen como entradas con `id === null`, así que
 * se baja un nivel a la vez. Usado por la invalidación de derivados.
 */
async function listAllUnder(prefix: string): Promise<string[]> {
  const { data, error } = await getClient()
    .storage.from(BUCKET)
    .list(prefix, { limit: 1000 });
  if (error || !data) return [];
  const out: string[] = [];
  for (const entry of data) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    // Carpeta (placeholder) → recursión; archivo → se agrega.
    if ((entry as { id: string | null }).id === null) {
      out.push(...(await listAllUnder(path)));
    } else {
      out.push(path);
    }
  }
  return out;
}

/**
 * Borra todos los objetos bajo un prefijo (no incluye el prefijo en sí).
 * Best-effort: si no hay nada, no hace nada. Se usa para invalidar los
 * derivados cacheados de un talento cuando se re-sube una imagen.
 */
export async function removeByPrefix(prefix: string): Promise<void> {
  const objectPrefix = toObjectPath(prefix).replace(/\/+$/, "");
  const files = await listAllUnder(objectPrefix);
  if (files.length === 0) return;
  const { error } = await getClient().storage.from(BUCKET).remove(files);
  if (error) throw new Error(`Storage purge failed for ${prefix}: ${error.message}`);
}

// Constantes de variantes compartidas (safe para client) — mismo re-export
// que hacia r2-client.ts para no cambiar el resto del codigo server.
export {
  VARIANTS,
  isValidVariant,
  buildKey,
  type ImageVariant,
} from "./image-variants";
