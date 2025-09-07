import { z } from "zod";
export const CreateEmergencyContact = z.object({
  relation: z
    .string()
    .min(1, "La relación es requerida")
    .max(50, "La relación debe tener menos de 50 carácteres"),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre debe tener menos de 50 carácteres"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .max(50, "El teléfono debe tener menos de 50 carácteres"),
  mobile: z
    .string()
    .min(1, "El celular es requerido")
    .max(50, "El celular debe tener menos de 50 carácteres"),
  address_line: z
    .string()
    .min(1, "La dirección es requerida")
    .max(100, "La dirección debe tener menos de 100 carácteres"),
  address_city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad debe tener menos de 100 carácteres"),
});

export type TCreateEmergencyContact = z.infer<typeof CreateEmergencyContact>;

export const EditEmergencyContact = z.object({
  id: z.coerce
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  relation: z
    .string()
    .min(1, "La relación es requerida")
    .max(50, "La relación debe tener menos de 50 carácteres"),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre debe tener menos de 50 carácteres"),
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
  address_line: z
    .string()
    .min(1, "La dirección es requerida")
    .max(100, "La dirección debe tener menos de 100 carácteres"),
  address_city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad debe tener menos de 100 carácteres"),
});

export type TEditEmergencyContact = z.infer<typeof EditEmergencyContact>;
