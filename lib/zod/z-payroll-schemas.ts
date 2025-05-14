import { z } from "zod";

export const CreatePayrollSchema = z.object({
  salary: z.number().positive("El salario no puede ser menor a 0").optional(),
  bonus: z.number().positive("El bonus no puede ser menor a 0").optional(),
  staff_id: z
    .number()
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser un número positivo")
    .optional(),
});
export type TCreatePayrollSchema = z.infer<typeof CreatePayrollSchema>;

export const EditPayrollSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  salary: z.number().positive("El salario no puede ser menor a 0").optional(),
  bonus: z.number().positive("El bonus no puede ser menor a 0").optional(),
  staff_id: z
    .number()
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser un número positivo")
    .optional(),
});
export type TEditPayrollSchema = z.infer<typeof EditPayrollSchema>;
