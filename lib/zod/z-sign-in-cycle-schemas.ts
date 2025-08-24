import { z } from "zod";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]\-_=+{}<>?/])[A-Za-z\d!@#$%^&*()\[\]\-_=+{}<>?/]{6,}$/;

export const signInSchema = z.object({
  username: z
    .string()
    .min(6, "El nombre de usuario no puede ser menor de 6 carácteres")
    .max(30, "El nombre de usuario no puede tener mas de 30 carácteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener mas de 6 carácteres")
    .max(30, "La contraseña no puede tener mas de 30 carácteres"),
  token: z.string().optional(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const SignInApiSchema = z.object({
  username: z
    .string()
    .min(6, "El nombre de usuario no puede ser menor de 6 carácteres")
    .max(30, "El nombre de usuario no puede tener mas de 30 carácteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener mas de 6 carácteres")
    .max(30, "La contraseña no puede tener mas de 30 carácteres"),
});

export type TSignInApiSchema = z.infer<typeof SignInApiSchema>;

export const createUserSchema = z.object({
  identification: z
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
  phone: z
    .string({ message: "Ingresa un teléfono válido" })
    .min(7, "El teléfono debe ser de mínimo 7 carácteres")
    .max(7, "El tamaño máximo de carácteres es de 7")
    .regex(/^(?!.*(\d)\1{6})[234]\d{6}$/, "Ingresa un teléfono válido")
    .transform((val) => parseInt(val, 10)),
  mobile: z
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
    .max(100, "El tamaño máximo de carácteres es de 100")
    .optional(),
  preconditions: z
    .string()
    .max(100, "El tamaño máximo de carácteres es de 100")
    .optional(),
  organization_id: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  token: z.string().optional(),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const changePasswordSchema = z
  .object({
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
    username: z
      .string()
      .min(6, "El nombre de usuario no puede ser menor de 6 carácteres")
      .max(30, "El nombre de usuario no puede tener mas de 30 carácteres"),
    actualPassword: z
      .string()
      .min(6, "La contraseña debe tener mas de 6 carácteres")
      .max(30, "La contraseña no puede tener mas de 30 carácteres")
      .regex(
        passwordRegex,
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial permitido."
      ),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener mas de 6 carácteres")
      .max(30, "La nueva contraseña no puede tener mas de 30 carácteres")
      .regex(
        passwordRegex,
        "La nueva contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial permitido."
      ),
    newPasswordConfirmation: z
      .string()
      .min(6, "La confirmación debe tener mas de 6 carácteres")
      .max(30, "La confirmación no puede tener mas de 30 carácteres")
      .regex(
        passwordRegex,
        "La confirmación debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial permitido."
      ),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "La nueva contraseña debe coincidir con la confirmación",
    path: ["newPasswordConfirmation"],
  })
  .refine((data) => data.newPassword !== data.actualPassword, {
    message: "La nueva contraseña no debe ser igual a la actual",
    path: ["newPassword"],
  });

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Correo inválido")
    .min(1, "El correo es requerido")
    .max(50, "El tamaño máximo de carácteres es de 50"),
  username: z
    .string()
    .min(6, "El nombre de usuario no puede ser menor de 6 carácteres")
    .max(30, "El nombre de usuario no puede tener mas de 30 carácteres"),
  token: z.string().optional(),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
