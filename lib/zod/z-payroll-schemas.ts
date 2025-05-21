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
  user_id: z.coerce
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  salary: z.coerce
    .number({
      message: "Debe ingresar un número",
    })
    .positive("El salario no puede ser menor a 0")
    .optional()
    .nullable(),
  bonus: z.coerce
    .number({
      message: "Debe ingresar un número",
    })
    .positive("El bonus no puede ser menor a 0")
    .optional()
    .nullable(),
});
export type TEditPayrollSchema = z.infer<typeof EditPayrollSchema>;
