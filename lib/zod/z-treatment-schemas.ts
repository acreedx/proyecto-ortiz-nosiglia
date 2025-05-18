import { z } from "zod";

export const CreateTreatmentSchema = z.object({
  treatment_type: z
    .string()
    .min(1, "El tipo de tratamiento es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  title: z
    .string()
    .min(1, "El título del tratamiento es requerido")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  description: z
    .string()
    .min(1, "La descripción del tratamiento es requerida")
    .max(200, "El tamaño máximo de carácteres es de 200"),
  estimated_appointments: z
    .number()
    .int("El número de citas estimadas debe ser un número entero")
    .positive("El número de citas estimadas debe ser positivo"),
  days_between_appointments: z
    .number()
    .int("El número de días entre citas debe ser un número entero")
    .positive("El número de días entre citas debe ser positivo"),
  cost_estimation: z
    .number()
    .min(0, "La estimación de costos debe ser un número positivo"),
});

export type TCreateTreatmentSchema = z.infer<typeof CreateTreatmentSchema>;

export const EditTreatmentSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  treatment_type: z
    .string()
    .min(1, "El tipo de tratamiento es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  title: z
    .string()
    .min(1, "El título del tratamiento es requerido")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  description: z
    .string()
    .min(1, "La descripción del tratamiento es requerida")
    .max(200, "El tamaño máximo de carácteres es de 200"),
  estimated_appointments: z
    .number()
    .int("El número de citas estimadas debe ser un número entero")
    .positive("El número de citas estimadas debe ser positivo"),
  days_between_appointments: z
    .number()
    .int("El número de días entre citas debe ser un número entero")
    .positive("El número de días entre citas debe ser positivo"),
  cost_estimation: z
    .number()
    .min(0, "La estimación de costos debe ser un número positivo"),
  status: z
    .string()
    .max(1, "El tamaño máximo del estado es de 1 carácter")
    .optional(),
});

export type TEditTreatmentSchema = z.infer<typeof EditTreatmentSchema>;
