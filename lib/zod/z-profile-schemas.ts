import { z } from "zod";

export const EditProfileSchema = z.object({
  id: z.coerce.number().min(1, "El id es obligatorio"),
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
    .string({ required_error: "La fecha de nacimiento es obligatoria" })
    .refine(
      (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        const today = new Date();
        const minDate = new Date(
          today.getFullYear() - 2,
          today.getMonth(),
          today.getDate()
        );
        return date <= minDate;
      },
      {
        message: "El paciente debe tener al menos 2 años de edad",
      }
    ),
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
});

export type TEditProfileSchema = z.infer<typeof EditProfileSchema>;
