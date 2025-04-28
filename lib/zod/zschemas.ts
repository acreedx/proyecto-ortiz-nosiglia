import { z } from "zod";

export const signInSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .max(50, "El nombre de usuario no puede tener mas de 50 carácteres"),
  password: z.string().min(4, "El password debe tener 4 carácteres mínimo"),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
