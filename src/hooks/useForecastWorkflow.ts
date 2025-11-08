import { useCallback, useEffect, useMemo, useState } from "react";
import type { ForecastAnalysis } from "../sharedTypes";
import type { MetricChip } from "../components/ForecastHero";
import { requestForecast } from "../lib/api";
import { formatDate } from "../lib/date";
import { exportAnalysisPdf } from "../lib/pdf";

const SAMPLE_QUESTION =
  "Will the U.S. military engage in armed conflict with Venezuela before November 30, 2025?";

const SAMPLE_CONTEXT =
  "Consider recent geopolitical tensions, sanctions, naval deployments, and the state of regional alliances such as Brazil and Colombia. Evaluate probable triggers and deterrents.";

type SubmitState = "idle" | "loading" | "success" | "error";

export function useForecastWorkflow() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState<ForecastAnalysis | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const disabled = submitState === "loading";

  useEffect(() => {
    if (analysis) {
      console.log("[client] Received analysis:", analysis);
    }
  }, [analysis]);

  const handleQuestionChange = useCallback((value: string) => {
    setQuestion(value);
  }, []);

  const handleContextChange = useCallback((value: string) => {
    setContext(value);
  }, []);

  const handleUseSample = useCallback(() => {
    console.log("[client] Applying sample prompt.");
    setQuestion(SAMPLE_QUESTION);
    setContext(SAMPLE_CONTEXT);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!question.trim()) {
        setErrorMessage("Please enter a forecasting question.");
        setSubmitState("error");
        return;
      }

      console.log("[client] Submitting forecast question:", {
        question,
        hasContext: Boolean(context.trim()),
      });

      setSubmitState("loading");
      setErrorMessage(null);

      try {
        const analysisResult = await requestForecast({
          question: question.trim(),
          context: context.trim() || undefined,
        });
        setAnalysis(analysisResult);
        setSubmitState("success");
      } catch (error) {
        console.error("[client] Forecast request failed:", error);
        setSubmitState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while contacting the forecasting service."
        );
      }
    },
    [context, question]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        const form = event.currentTarget.form;
        if (form) {
          console.log("[client] Shortcut submit triggered.");
          form.requestSubmit();
        }
      }
    },
    []
  );

  const extractHostname = useCallback((url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, []);

  const chipMetrics = useMemo<MetricChip[]>(() => {
    if (!analysis) return [];
    const confidence = analysis.likelihood.confidence;
    const confidenceDisplay =
      confidence.charAt(0).toUpperCase() + confidence.slice(1);
    return [
      {
        label: "Confidence",
        value: confidenceDisplay,
        variant: `confidence-${confidence}`,
      },
      {
        label: "Time horizon",
        value: analysis.timeHorizon,
        variant: "time",
      },
      {
        label: "Question",
        value: analysis.question,
        variant: "question",
      },
    ];
  }, [analysis]);

  const narrativeText = analysis?.likelihood.narrative?.trim();
  const summaryText = analysis?.shortSummary?.trim();
  const showNarrative =
    Boolean(narrativeText) &&
    (!summaryText ||
      narrativeText?.toLowerCase() !== summaryText.toLowerCase());

  const updatedAtLabel = analysis
    ? `Updated ${formatDate(analysis.updatedAt)}`
    : "";

  const handleExportPdf = useCallback(() => {
    if (analysis) {
      exportAnalysisPdf(analysis);
    }
  }, [analysis]);

  return {
    question,
    context,
    analysis,
    submitState,
    errorMessage,
    disabled,
    chipMetrics,
    narrativeText,
    showNarrative,
    updatedAtLabel,
    handleQuestionChange,
    handleContextChange,
    handleUseSample,
    handleSubmit,
    handleKeyDown,
    extractHostname,
    handleExportPdf,
  };
}
