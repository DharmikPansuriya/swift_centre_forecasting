import type { ZodSchema } from "zod";
import type { ForecastAnalysis } from "../sharedTypes";
import type { ForecastRequestInput } from "../schemas/forecastRequest";

type ForecastService = {
  generateForecast: (
    question: string,
    context?: string
  ) => Promise<ForecastAnalysis>;
};

export function buildForecastRoute(
  service: ForecastService | null,
  requestSchema: ZodSchema<ForecastRequestInput>
) {
  return {
    async POST(req: Request) {
      if (!service) {
        console.error(
          "[api] Forecast service unavailable: missing GEMINI_KEY."
        );
        return Response.json(
          {
            error:
              "Forecasting service is not configured. Set the GEMINI_KEY environment variable.",
          },
          { status: 500 }
        );
      }

      let payload: unknown;
      try {
        payload = await req.json();
      } catch (error) {
        console.warn("[api] Failed to parse request body.", error);
        return Response.json(
          { error: "Request body must be valid JSON." },
          { status: 400 }
        );
      }

      const parsed = requestSchema.safeParse(payload);
      if (!parsed.success) {
        console.warn("[api] Validation errors:", parsed.error.flatten());
        return Response.json(
          {
            error: "Invalid request.",
            details: parsed.error.flatten(),
          },
          { status: 400 }
        );
      }

      const { question, context } = parsed.data;
      console.log("[api] Processing forecast for question:", question);

      try {
        const analysis = await service.generateForecast(question, context);
        return Response.json({ analysis });
      } catch (error) {
        console.error("[api] Forecast generation failed:", error);
        return Response.json(
          {
            error:
              "Unable to generate analysis at this time. Please try again shortly.",
          },
          { status: 502 }
        );
      }
    },
  };
}
