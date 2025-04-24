import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "El email es requerido"),
  password: z.string().min(4, "El password debe tener 4 carácteres mínimo"),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
