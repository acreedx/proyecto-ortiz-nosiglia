import { z } from "zod";

export const CreateCarePlanSchema = z.object({
  treatment_type: z
    .string()
    .min(1, "El tipo de tratamiento es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(200, "Máximo 200 caracteres"),
  start_date: z
    .string({ required_error: "La fecha de inicio es obligatoria" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
    .optional(),
  estimated_appointments: z.number({
    required_error: "El número estimado de citas es obligatorio",
  }),
  days_between_appointments: z.number({
    required_error: "Los días entre citas son obligatorios",
  }),
  total_appointments: z.number().optional(),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "El costo debe ser un número válido"),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
});
export type TCreateCarePlanSchema = z.infer<typeof CreateCarePlanSchema>;
