import { z } from "zod";

export const signInSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .max(50, "El nombre de usuario no puede tener mas de 50 carácteres"),
  password: z.string().min(4, "El password debe tener 4 carácteres mínimo"),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const createUserSchema = z.object({
  identification: z
    .string({ message: "Ingresa un teléfono válido" })
    .min(1, "El campo es requerido")
    .max(50, "El tamaño máximo es de 50")
    .regex(/^\d+$/, "Ingresa un teléfono válido")
    .transform((val) => parseInt(val, 10)),
  first_name: z
    .string()
    .min(1, "Los nombres son requeridos")
    .max(50, "El tamaño máximo es de 50"),
  last_name: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .max(50, "El tamaño máximo es de 50"),
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .max(50, "El tamaño máximo es de 50"),
  phone: z
    .string({ message: "Ingresa un teléfono válido" })
    .min(1, "El teléfono es requerido")
    .max(50, "El tamaño máximo es de 50")
    .regex(/^\d+$/, "Ingresa un teléfono válido")
    .transform((val) => parseInt(val, 10)),
  mobile: z
    .string({ message: "Ingresa un teléfono válido" })
    .min(1, "El celular es requerido")
    .max(50, "El tamaño máximo es de 50")
    .regex(/^\d+$/, "Ingresa un celular válido")
    .transform((val) => parseInt(val, 10)),
  email: z
    .string()
    .email("Correo inválido")
    .min(1, "El correo es requerido")
    .max(50, "El tamaño máximo es de 50"),
  address_line: z
    .string()
    .min(1, "La dirección es requerida")
    .max(50, "El tamaño máximo es de 50"),
  address_city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(50, "El tamaño máximo es de 50"),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const changePasswordSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .max(50, "El tamaño máximo es de 50"),
  actualPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(1, "La nueva contraseña es requerida"),
  newPasswordConfirmation: z.string().min(1, "La confirmación es requerida"),
});

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Correo inválido")
    .min(1, "El correo es requerido")
    .max(50, "El tamaño máximo es de 50"),
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .max(50, "El tamaño máximo es de 50"),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
