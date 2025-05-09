import { z } from "zod";
export const testSchema = z.object({
  testField: z.string(),
});

export type TTestSchema = z.infer<typeof testSchema>;
