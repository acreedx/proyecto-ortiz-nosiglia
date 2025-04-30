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
  identification: z.string().min(1, "El campo es requerido"),
  first_name: z.string().min(1, "El campo es requerido"),
  last_name: z.string().min(1, "El campo es requerido"),
  birth_date: z.string().min(1, "El campo es requerido"),
  phone: z.string().min(1, "El campo es requerido"),
  mobile: z.string().min(1, "El campo es requerido"),
  email: z.string().min(1, "El campo es requerido"),
  address_line: z.string().min(1, "El campo es requerido"),
  address_city: z.string().min(1, "El campo es requerido"),
  photo_url: z.string().min(1, "El campo es requerido"),
  role_id: z.string().min(1, "El campo es requerido"),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;

export const changePasswordSchema = z.object({});

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
