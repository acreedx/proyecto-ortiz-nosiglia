import { z } from "zod";

export const PayrollSchema = z.object({
  salary: z.number().positive("El salario no puede ser menor a 0").optional(),
  bonus: z.number().positive("El bonus no puede ser menor a 0").optional(),
  staff_id: z
    .number()
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser un número positivo")
    .optional(),
});
export type TPayrollSchema = z.infer<typeof PayrollSchema>;
