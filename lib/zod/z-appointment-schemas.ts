import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  scheduled_on: z
    .string({ required_error: "La fecha de programación es obligatoria" })
    .datetime("Formato de fecha inválido"),
  programed_date_time: z
    .string({ required_error: "La fecha programada es obligatoria" })
    .datetime("Formato de fecha inválido"),
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
  cancellation_date: z
    .string()
    .datetime("Formato de fecha inválido")
    .optional(),
  cancellation_reason: z.string().max(200, "Máximo 200 caracteres").optional(),
  is_cancelled: z.boolean().optional(),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
  doctor_id: z
    .string({ message: "El doctor es obligatorio" })
    .transform((val) => parseInt(val, 10)),
});
export type TCreateAppointmentSchema = z.infer<typeof CreateAppointmentSchema>;

export const EditAppointmentSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  scheduled_on: z
    .string({ required_error: "La fecha de programación es obligatoria" })
    .datetime("Formato de fecha inválido"),
  programed_date_time: z
    .string({ required_error: "La fecha programada es obligatoria" })
    .datetime("Formato de fecha inválido"),
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
  cancellation_date: z
    .string()
    .datetime("Formato de fecha inválido")
    .optional(),
  cancellation_reason: z.string().max(200, "Máximo 200 caracteres").optional(),
  is_cancelled: z.boolean().optional(),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
  doctor_id: z.number({ required_error: "El ID del doctor es obligatorio" }),
});
export type TEditAppointmentSchema = z.infer<typeof EditAppointmentSchema>;
