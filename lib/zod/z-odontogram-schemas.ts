import { z } from "zod";
export const EditOdontogramSchema = z.object({
  diagnostico: z
    .string()
    .max(200, "El diagnóstico debe tener menos de 200 carácteres")
    .optional()
    .nullable(),
  tratamiento: z
    .string()
    .max(200, "El tratamiento debe tener menos de 200 carácteres")
    .optional()
    .nullable(),
  fecha: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "La fecha debe tener el formato MM/DD/YYYY")
    .refine((value) => {
      const [month, day, year] = value.split("/").map(Number);
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return inputDate <= today;
    }, "La fecha no puede ser posterior a hoy")
    .optional()
    .nullable(),
});

export type TEditOdontogramSchema = z.infer<typeof EditOdontogramSchema>;
