import { z } from "zod";
export const CreateAccountSchema = z.object({
  balance: z
    .string()
    .min(1, "El saldo es obligatorio")
    .regex(/^\d+(\.\d{1,2})?$/, "El saldo debe ser un número válido"),
  billing_status: z
    .string()
    .min(1, "El estado de facturación es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  calculated_at: z
    .string({ required_error: "La fecha de cálculo debe ser válida" })
    .datetime("Formato de fecha no válido")
    .optional(),
});

export type TCreateAccountSchema = z.infer<typeof CreateAccountSchema>;

export const EditAccountSchema = z.object({
  id: z.number().min(1, "El id es obligatorio"),
  balance: z
    .string()
    .min(1, "El saldo es obligatorio")
    .regex(/^\d+(\.\d{1,2})?$/, "El saldo debe ser un número válido"),
  billing_status: z
    .string()
    .min(1, "El estado de facturación es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  calculated_at: z
    .string({ required_error: "La fecha de cálculo debe ser válida" })
    .datetime("Formato de fecha no válido")
    .optional(),
});

export type TEditAccountSchema = z.infer<typeof EditAccountSchema>;
