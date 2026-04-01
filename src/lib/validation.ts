import { z } from "zod/v4";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nombre demasiado corto")
    .max(100, "Nombre demasiado largo")
    .transform((v) => v.trim()),
  email: z
    .email("Email inválido")
    .max(254, "Email demasiado largo")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .max(20, "Teléfono demasiado largo")
    .optional()
    .transform((v) => v?.trim() || undefined),
  subject: z
    .string()
    .min(3, "Asunto demasiado corto")
    .max(200, "Asunto demasiado largo")
    .transform((v) => v.trim()),
  message: z
    .string()
    .min(10, "Mensaje demasiado corto")
    .max(5000, "Mensaje demasiado largo")
    .transform((v) => v.trim()),
});

export type ContactFormData = z.infer<typeof contactSchema>;
