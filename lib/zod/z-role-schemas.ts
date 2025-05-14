import { z } from "zod";

export const RoleSchema = z.object({
  role_name: z
    .string()
    .min(1, "El nombre del rol es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre del rol solo puede contener letras, números y guiones bajos"
    ),
  description: z
    .string()
    .min(1, "La descripción del rol es requerida")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  is_protected: z.boolean(),
  status: z
    .string()
    .max(1, "El tamaño máximo del estado es de 1 carácter")
    .optional(),
});

export type TRoleSchema = z.infer<typeof RoleSchema>;

export const EditRoleSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  role_name: z
    .string()
    .min(1, "El nombre del rol es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre del rol solo puede contener letras, números y guiones bajos"
    ),
  description: z
    .string()
    .min(1, "La descripción del rol es requerida")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  is_protected: z.boolean(),
  status: z
    .string()
    .max(1, "El tamaño máximo del estado es de 1 carácter")
    .optional(),
});

export type TEditRoleSchema = z.infer<typeof EditRoleSchema>;
