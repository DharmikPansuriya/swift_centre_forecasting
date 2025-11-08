import type {
  ForecastAnalysis,
  ForecastRequestPayload,
  ForecastResponsePayload,
} from "../sharedTypes";

export async function requestForecast(
  payload: ForecastRequestPayload
): Promise<ForecastAnalysis> {
  const response = await fetch("/api/forecast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `The server returned an error (${response.status}). Please try again in a moment.`;
    try {
      const errorData = (await response.json()) as ForecastResponsePayload;
      if (errorData?.error) {
        message = errorData.error;
      }
    } catch {
      // ignore JSON parse failures; keep default message
    }
    throw new Error(message);
  }

  const data = (await response.json()) as ForecastResponsePayload;
  if (!data.analysis) {
    throw new Error("The analysis response was empty. Please try again.");
  }

  return data.analysis;
}
