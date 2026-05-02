import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/**
 * Cliente Cloudflare R2 (S3-compatible).
 *
 * Bucket privado: NUNCA se exponen URLs publicas. Las imagenes se sirven
 * via API route protegida (`/api/studio/talent/image/[code]/[variant]`)
 * que valida sesion + ownership y aplica watermark dinamico.
 *
 * Convencion de keys: `talents/${code}/${variant}.jpg`
 */

let _client: S3Client | null = null;
function getClient(): S3Client {
  if (_client) return _client;
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 not configured: set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
    );
  }
  _client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function bucket(): string {
  const b = process.env.R2_BUCKET;
  if (!b) throw new Error("R2_BUCKET not configured");
  return b;
}

/** Lee imagen desde R2 y devuelve buffer. Lanza si no existe. */
export async function getImageBuffer(key: string): Promise<Buffer> {
  const response = await getClient().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key })
  );
  // ResponseStream es Readable | undefined dependiendo del runtime
  if (!response.Body) throw new Error(`R2 object ${key} has empty body`);
  // transformToByteArray esta disponible en @smithy v3+
  const bytes = await (
    response.Body as { transformToByteArray: () => Promise<Uint8Array> }
  ).transformToByteArray();
  return Buffer.from(bytes);
}

export async function uploadImage(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      // Sin ACL public — el bucket no permite public read
    })
  );
}

export async function deleteImage(key: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: bucket(), Key: key })
  );
}

// VARIANTS / ImageVariant / isValidVariant / buildKey viven en
// `image-variants.ts` (safe para client). Re-exportamos aqui para que el
// codigo server existente siga funcionando sin cambios.
export {
  VARIANTS,
  isValidVariant,
  buildKey,
  type ImageVariant,
} from "./image-variants";
