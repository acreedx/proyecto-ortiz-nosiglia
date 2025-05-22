import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  programed_date_time: z
    .string({ required_error: "La fecha programada es obligatoria" })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "La fecha no es válida",
      }
    ),
  specialty: z
    .string()
    .min(1, "La especialidad es obligatoria")
    .max(50, "Máximo 50 caracteres"),
  reason: z
    .string()
    .min(1, "El motivo es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  note: z.string().max(200, "Máximo 200 caracteres").optional(),
  patient_instruction: z.string().max(200, "Máximo 200 caracteres").optional(),
  patient_id: z.coerce.number({
    required_error: "El ID del paciente es obligatorio",
  }),
  doctor_id: z.coerce.number({
    required_error: "El ID del doctor es obligatorio",
  }),
});
export type TCreateAppointmentSchema = z.infer<typeof CreateAppointmentSchema>;

export const EditAppointmentSchema = z.object({
  id: z.coerce.number({
    required_error: "El ID es obligatorio",
  }),
  programed_date_time: z
    .string({ required_error: "La fecha programada es obligatoria" })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "La fecha no es válida",
      }
    ),
  specialty: z
    .string()
    .min(1, "La especialidad es obligatoria")
    .max(50, "Máximo 50 caracteres"),
  reason: z
    .string()
    .min(1, "El motivo es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  note: z.string().max(200, "Máximo 200 caracteres").optional(),
  patient_instruction: z.string().max(200, "Máximo 200 caracteres").optional(),
  doctor_id: z.coerce.number({
    required_error: "El ID del doctor es obligatorio",
  }),
});
export type TEditAppointmentSchema = z.infer<typeof EditAppointmentSchema>;
