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
  estimated_appointments: z.number({
    required_error: "El número estimado de citas es obligatorio",
  }),
  days_between_appointments: z.number({
    required_error: "Los días entre citas son obligatorios",
  }),
  cost: z.coerce
    .number({
      message: "Ingresa un número válido",
    })
    .min(0, "El costo debe ser un número positivo"),
  patient_id: z.coerce.number({
    required_error: "El ID del paciente es obligatorio",
  }),
  treatment_type_id: z.coerce
    .number({
      required_error: "Ingrese un id válido",
    })
    .optional(),
});
export type TCreateCarePlanSchema = z.infer<typeof CreateCarePlanSchema>;

export const EditCarePlanSchema = z.object({
  id: z.coerce.number({
    required_error: "El ID del tratamiento es obligatorio",
  }),
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
  estimated_appointments: z.number({
    required_error: "El número estimado de citas es obligatorio",
  }),
  days_between_appointments: z.number({
    required_error: "Los días entre citas son obligatorios",
  }),
  cost: z.coerce
    .number({
      message: "Ingresa un número válido",
    })
    .min(0, "El costo debe ser un número positivo"),
  patient_id: z.coerce.number({
    required_error: "El ID del paciente es obligatorio",
  }),
  treatment_type_id: z.coerce
    .number({
      required_error: "Ingrese un id válido",
    })
    .optional(),
});
export type TEditCarePlanSchema = z.infer<typeof EditCarePlanSchema>;
