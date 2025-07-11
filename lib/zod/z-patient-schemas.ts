import { z } from "zod";

export const CreatePatientSchema = z.object({
  identification: z.coerce
    .string({ message: "Ingresa un Carnet válido" })
    .min(7, "El carnet de identidad es requerido")
    .max(9, "El tamaño máximo de carácteres es de 9")
    .regex(/^\d+$/, "Ingresa un Carnet válido")
    .transform((val) => parseInt(val, 10)),
  first_name: z
    .string()
    .min(1, "Los nombres son requeridos")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  last_name: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  phone: z.coerce
    .string({ message: "Ingresa un teléfono válido" })
    .min(7, "El teléfono debe ser de mínimo 7 carácteres")
    .max(7, "El tamaño máximo de carácteres es de 7")
    .regex(/^(?!.*(\d)\1{6})[234]\d{6}$/, "Ingresa un teléfono válido")
    .transform((val) => parseInt(val, 10)),
  mobile: z.coerce
    .string({ message: "Ingresa un teléfono válido" })
    .min(8, "El celular debe ser de mínimo 8 carácteres")
    .max(8, "El tamaño máximo de carácteres es de 8")
    .regex(/^(?!.*(\d)\1{7})[67]\d{7}$/, "Ingresa un celular válido")
    .transform((val) => parseInt(val, 10)),
  email: z
    .string()
    .email("Correo inválido")
    .min(1, "El correo es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  address_line: z
    .string()
    .min(1, "La dirección es requerida")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  address_city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  allergies: z
    .string()
    .max(200, "Las alergias no pueden tener mas de 200 carácteres")
    .optional(),
  preconditions: z
    .string()
    .max(200, "Las precondiciones no pueden tener mas de 200 carácteres")
    .optional(),
  organization_id: z.coerce.number(),
});

export type TCreatePatientSchema = z.infer<typeof CreatePatientSchema>;

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
  organization_id: z.coerce
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : Number(val))),
});

export type TEditPatientSchema = z.infer<typeof EditPatientSchema>;
