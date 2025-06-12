import { z } from "zod";

export const CreateAppointmentCalendarSchema = z.object({
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
  hora_cita: z.string(),
  reason: z
    .string()
    .min(1, "El motivo es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  doctor_id: z.coerce.number({
    required_error: "El ID del paciente es obligatorio",
  }),
});
export type TCreateAppointmentCalendarSchema = z.infer<
  typeof CreateAppointmentCalendarSchema
>;

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
  hora_cita: z.string(),
  reason: z
    .string()
    .min(1, "El motivo es obligatorio")
    .max(100, "Máximo 100 caracteres"),
});
export type TEditAppointmentSchema = z.infer<typeof EditAppointmentSchema>;

export const CompleteAppointmentSchema = z.object({
  id: z.coerce.number({
    required_error: "El ID es obligatorio",
  }),
  diagnosis: z
    .string()
    .min(1, "El diagnóstico es obligatorio")
    .max(200, "Máximo 100 carácteres"),
});
export type TCompleteAppointmentSchema = z.infer<
  typeof CompleteAppointmentSchema
>;

export const CancelAppointmentSchema = z.object({
  id: z.coerce.number({
    required_error: "El ID es obligatorio",
  }),
  cancellation_reason: z
    .string()
    .min(1, "La razón es obligatoria")
    .max(200, "Máximo 100 carácteres"),
});
export type TCancelAppointmentSchema = z.infer<typeof CancelAppointmentSchema>;
