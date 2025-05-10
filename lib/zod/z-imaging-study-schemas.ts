import { z } from "zod";
export const ImagingStudySchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  media: z.string().max(255, "Máximo 255 caracteres").optional(),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "El costo debe ser un número válido")
    .optional(),
  status: z.string().length(1, "El estado debe tener un carácter").optional(),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
});

export type TImagingStudySchema = z.infer<typeof ImagingStudySchema>;
