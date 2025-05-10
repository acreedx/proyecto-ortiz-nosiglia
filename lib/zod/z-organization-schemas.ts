import { z } from "zod";
export const OrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la organización es obligatorio")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  address: z
    .string()
    .min(1, "La dirección es obligatoria")
    .max(200, "La dirección no puede exceder los 200 caracteres"),
  status: z.string().length(1, "El estado debe tener un carácter").optional(),
});

export type TOrganizationSchema = z.infer<typeof OrganizationSchema>;
