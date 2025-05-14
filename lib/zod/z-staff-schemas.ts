import { z } from "zod";

export const StaffSchema = z.object({
  contratation_date: z
    .string()
    .min(1, "La fecha de contratación es requerida")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de contratación no es válida",
    }),
  separation_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fecha de separación no es válida",
    }),
  status: z
    .string()
    .max(1, "El tamaño máximo del estado es de 1 carácter")
    .optional(),
  user_id: z
    .number()
    .int("El ID de usuario debe ser un número entero")
    .positive("El ID de usuario debe ser positivo"),
});

export type T = z.infer<typeof StaffSchema>;

export const EditStaffSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  contratation_date: z
    .string()
    .min(1, "La fecha de contratación es requerida")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de contratación no es válida",
    }),
  separation_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "La fecha de separación no es válida",
    }),
  status: z
    .string()
    .max(1, "El tamaño máximo del estado es de 1 carácter")
    .optional(),
  user_id: z
    .number()
    .int("El ID de usuario debe ser un número entero")
    .positive("El ID de usuario debe ser positivo"),
});

export type TEditStaffSchema = z.infer<typeof EditStaffSchema>;
