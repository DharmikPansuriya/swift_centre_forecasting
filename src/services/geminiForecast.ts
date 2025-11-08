import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ForecastAnalysis } from "../sharedTypes";

const GEMINI_MODEL = "models/gemini-2.5-flash";
const MAX_GEMINI_ATTEMPTS = 3;

const RESPONSE_FORMAT = `
interface ForecastAnalysis {
  question: string;
  likelihood: {
    verdict: "True" | "False" | "Inconclusive";
    probabilityPercent: number;
    confidence: "low" | "medium" | "high";
    narrative: string;
  };
  shortSummary: string;
  keyDrivers: { title: string; direction: "increase" | "decrease" | "uncertain"; detail: string }[];
  counterSignals: { title: string; detail: string }[];
  scenarios: { name: string; probabilityPercent: number; summary: string }[];
  monitoring: { item: string; why: string; action: string }[];
  recommendedSources: { title: string; url: string; insight: string }[];
  timeHorizon: string;
  updatedAt: string;
}
`.trim();

function sanitizeGeminiJson(raw: string) {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeAnalysis(analysis: ForecastAnalysis): ForecastAnalysis {
  const asConfidence = (
    value: unknown
  ): ForecastAnalysis["likelihood"]["confidence"] => {
    if (typeof value !== "string") return "low";
    const normalized = value.toLowerCase();
    if (
      normalized === "low" ||
      normalized === "medium" ||
      normalized === "high"
    ) {
      return normalized;
    }
    return "low";
  };

  const probabilityInput =
    (analysis as { likelihood?: { probabilityPercent?: unknown } }).likelihood
      ?.probabilityPercent ??
    analysis.likelihood?.probabilityPercent ??
    0;

  const probability = Number(probabilityInput);
  const normalizedLikelihood: ForecastAnalysis["likelihood"] = {
    verdict:
      analysis.likelihood?.verdict === "True" ||
      analysis.likelihood?.verdict === "False" ||
      analysis.likelihood?.verdict === "Inconclusive"
        ? analysis.likelihood.verdict
        : "Inconclusive",
    probabilityPercent: Number.isFinite(probability) ? probability : 0,
    confidence: asConfidence(analysis.likelihood?.confidence),
    narrative:
      analysis.likelihood?.narrative ||
      analysis.shortSummary ||
      analysis.question,
  };

  return {
    ...analysis,
    likelihood: normalizedLikelihood,
    shortSummary:
      analysis.shortSummary ||
      normalizedLikelihood.narrative ||
      analysis.question,
    keyDrivers: analysis.keyDrivers?.filter(Boolean) ?? [],
    counterSignals: analysis.counterSignals?.filter(Boolean) ?? [],
    scenarios: analysis.scenarios?.filter(Boolean) ?? [],
    monitoring: analysis.monitoring?.filter(Boolean) ?? [],
    recommendedSources: analysis.recommendedSources?.filter(Boolean) ?? [],
    timeHorizon: analysis.timeHorizon || "Not specified",
    updatedAt: analysis.updatedAt || new Date().toISOString(),
  };
}

function buildInstruction(isRetry: boolean) {
  const instruction = `
You are an analyst supporting professional forecasters. Provide concise, evidence-grounded analysis for true/false questions. Respond with compact JSON only—no markdown fences or commentary.
`.trim();

  if (!isRetry) {
    return instruction;
  }

  return `${instruction}\n\nRetry constraints:\n- Keep arrays to at most 3 items.\n- Keep each string under 140 characters.\n- Focus only on the most decision-relevant evidence.`;
}

function buildPrompt(
  question: string,
  context: string | undefined,
  isRetry: boolean
) {
  const base = `
${buildInstruction(isRetry)}

Required JSON structure (TypeScript):
${RESPONSE_FORMAT}

Constraints:
- Probability values must be between 0 and 100.
- Use current, reputable sources and provide real URLs.
- The updatedAt field must be an ISO 8601 UTC timestamp for "now".

Question: ${question.trim()}
Context: ${context?.trim() || "None provided."}

Return JSON only.`;

  if (isRetry) {
    return `${base}\n\nPrevious response was truncated. Respond even more concisely while preserving valid JSON.`;
  }

  return base;
}

export function createForecastService(apiKey: string) {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: GEMINI_MODEL });

  async function generateForecast(
    question: string,
    context?: string,
    attempt = 1
  ): Promise<ForecastAnalysis> {
    const isRetry = attempt > 1;
    const prompt = buildPrompt(question, context, isRetry);

    console.log(
      `[gemini] Sending request (attempt ${attempt}/${MAX_GEMINI_ATTEMPTS}) for question:`,
      question
    );

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const finishReason = response.candidates?.[0]?.finishReason;
    const textPayload = response.text().trim();

    console.log("[gemini] Response metadata:", {
      finishReason,
      totalTokens: response.usageMetadata?.totalTokenCount,
    });

    if (
      (!textPayload || finishReason === "MAX_TOKENS") &&
      attempt < MAX_GEMINI_ATTEMPTS
    ) {
      console.warn(
        `[gemini] Empty or truncated response (finishReason=${finishReason}). Retrying attempt ${
          attempt + 1
        }/${MAX_GEMINI_ATTEMPTS}.`
      );
      return generateForecast(question, context, attempt + 1);
    }

    if (!textPayload) {
      console.error("[gemini] Empty response payload:", response);
      throw new Error("Gemini returned an empty response.");
    }

    const cleaned = sanitizeGeminiJson(textPayload);

    try {
      const parsed = JSON.parse(cleaned) as ForecastAnalysis;
      console.log("[gemini] Successfully parsed analysis.");
      return normalizeAnalysis(parsed);
    } catch (error) {
      console.error("[gemini] Failed to parse JSON. Raw payload:", cleaned);
      throw new Error("Unable to parse Gemini response.");
    }
  }

  return {
    generateForecast,
  };
}
