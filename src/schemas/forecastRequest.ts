import { z } from "zod";

export const forecastRequestSchema = z.object({
  question: z
    .string()
    .min(10, { message: "Question should include enough detail to analyze." })
    .max(500, { message: "Question must be under 500 characters." }),
  context: z
    .string()
    .max(1500, { message: "Context must be under 1500 characters." })
    .optional(),
});

export type ForecastRequestInput = z.infer<typeof forecastRequestSchema>;
