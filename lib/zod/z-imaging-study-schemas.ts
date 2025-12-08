import { z } from "zod";
export const CreateImagingStudySchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  cost: z
    .number({
      required_error: "El costo estimado es obligatorio",
      invalid_type_error: "Ingrese un número válido",
    })
    .positive("Ingrese un número positivo"),
  discount: z.coerce
    .number({ invalid_type_error: "Ingrese un número válido" })
    .min(0, "Debe ser mayor o igual a 0")
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Debe tener máximo 2 decimales",
    }),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
});

export type TCreateImagingStudySchema = z.infer<
  typeof CreateImagingStudySchema
>;

export const EditImagingStudySchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  cost: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "El costo debe ser un número válido")
    .optional(),
  discount: z.coerce
    .number({ invalid_type_error: "Ingrese un número válido" })
    .min(0, "Debe ser mayor o igual a 0")
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: "Debe tener máximo 2 decimales",
    }),
  patient_id: z.number({ required_error: "El ID del paciente es obligatorio" }),
});

export type TEditImagingStudySchema = z.infer<typeof EditImagingStudySchema>;
