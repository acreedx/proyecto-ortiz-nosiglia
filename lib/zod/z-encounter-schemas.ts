import { z } from "zod";

export const EncounterSchema = z.object({
  type: z
    .string()
    .min(1, "El tipo de encuentro es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  performed_on: z
    .string({ required_error: "La fecha de realización es obligatoria" })
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
  diagnosis: z
    .string()
    .min(1, "El diagnóstico es obligatorio")
    .max(200, "Máximo 200 caracteres"),
  status: z.string().length(1, "El estado debe tener un carácter").optional(),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
  doctor_id: z.number({ required_error: "El ID del doctor es obligatorio" }),
});

export type TEncounterSchema = z.infer<typeof EncounterSchema>;
