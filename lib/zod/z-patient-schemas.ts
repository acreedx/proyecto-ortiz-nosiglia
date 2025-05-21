import { z } from "zod";
export const EditPatientSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  allergies: z
    .string()
    .min(1, "Las alergias deben tener almenos un carácter")
    .max(200, "Las alergias no pueden tener mas de 200 carácteres")
    .optional(),
  preconditions: z
    .string()
    .min(1, "Las precondiciones deben tener almenos un carácter")
    .max(200, "Las precondiciones no pueden tener mas de 200 carácteres")
    .optional(),
  organization_id: z.coerce.number(),
});

export type TEditPatientSchema = z.infer<typeof EditPatientSchema>;
