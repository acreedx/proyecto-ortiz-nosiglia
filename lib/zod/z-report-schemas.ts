import { z } from "zod";

export const GenerateReportSchema = z
  .object({
    from: z.coerce
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "La fecha no es válida",
      })
      .transform((val) => (val ? new Date(val) : undefined)),

    to: z.coerce
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "La fecha no es válida",
      })
      .transform((val) => (val ? new Date(val) : undefined)),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        const fromDate = new Date(data.from);
        const toDate = new Date(data.to);
        return fromDate <= toDate;
      }
      return true;
    },
    {
      message: "La fecha de fin no puede ser menor que la fecha fin",
      path: ["to"],
    }
  );
export type TGenerateReportSchema = z.infer<typeof GenerateReportSchema>;
