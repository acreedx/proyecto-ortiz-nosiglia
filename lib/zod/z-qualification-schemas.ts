import { z } from "zod";

export const CreateQualificationSchema = z.object({
  type: z
    .string()
    .min(1, "El tipo de título es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  name: z
    .string()
    .min(1, "El nombre del título es requerido")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  institution: z
    .string()
    .min(1, "La institución es requerida")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  country: z
    .string()
    .max(50, "El tamaño máximo del país es de 50 caracteres")
    .optional(),
  //todo validar que la fecha no pueda ser menor a la fecha actual igualmente en en el de editar
  obtainment_date: z
    .string()
    .min(1, "La fecha de obtención es requerida")
    .max(50, "El tamaño máximo de carácteres es de 50")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de obtención no es válida",
    }),
  doctor_id: z.number({ required_error: "El ID del doctor es obligatorio" }),
});

export type TCreateQualificationSchema = z.infer<
  typeof CreateQualificationSchema
>;

export const EditQualificationSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  type: z
    .string()
    .min(1, "El tipo de título es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  name: z
    .string()
    .min(1, "El nombre del título es requerido")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  institution: z
    .string()
    .min(1, "La institución es requerida")
    .max(100, "El tamaño máximo de carácteres es de 100"),
  country: z
    .string()
    .max(50, "El tamaño máximo del país es de 50 caracteres")
    .optional(),
  obtainment_date: z
    .string()
    .min(1, "La fecha de obtención es requerida")
    .max(50, "El tamaño máximo de carácteres es de 50")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "La fecha de obtención no es válida",
    }),
});

export type TEditQualificationSchema = z.infer<typeof EditQualificationSchema>;
