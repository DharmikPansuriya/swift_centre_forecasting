import { serve } from "bun";
import index from "./index.html";
import { forecastRequestSchema } from "./schemas/forecastRequest";
import { createForecastService } from "./services/geminiForecast";
import { buildForecastRoute } from "./routes/forecastRoute";

const GEMINI_KEY = process.env.GEMINI_KEY;

const forecastService = GEMINI_KEY ? createForecastService(GEMINI_KEY) : null;
if (!GEMINI_KEY) {
  console.warn(
    "[startup] GEMINI_KEY is not set. Forecast endpoint will return a configuration error."
  );
}

const server = serve({
  routes: {
    "/*": index,
    "/api/forecast": buildForecastRoute(forecastService, forecastRequestSchema),
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
