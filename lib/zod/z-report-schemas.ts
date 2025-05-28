import { z } from "zod";

export const GenerateReportSchema = z.object({
  from: z
    .string({ message: "La fecha no es válida" })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "La fecha no es válida",
      }
    )
    .optional(),
  to: z
    .string({ message: "La fecha no es válida" })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "La fecha no es válida",
      }
    )
    .optional(),
});
export type TGenerateReportSchema = z.infer<typeof GenerateReportSchema>;
