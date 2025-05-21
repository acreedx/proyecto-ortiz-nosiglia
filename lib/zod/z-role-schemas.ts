import { z } from "zod";

export const RoleSchema = z.object({
  role_name: z
    .string()
    .min(1, "El nombre del rol es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre del rol solo puede contener letras, números y guiones bajos sin espacios"
    ),
  description: z
    .string()
    .min(1, "La descripción del rol es requerida")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  permissions: z
    .array(z.coerce.number(), {
      message: "Debes seleccionar al menos un permiso",
    })
    .min(1, "Debes seleccionar al menos un permiso"),
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
  permissions: z
    .array(z.coerce.number())
    .min(1, "Debes seleccionar al menos un permiso"),
});

export type TEditRoleSchema = z.infer<typeof EditRoleSchema>;
