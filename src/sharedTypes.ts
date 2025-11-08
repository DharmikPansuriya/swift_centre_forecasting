export type ForecastDirection = "increase" | "decrease" | "uncertain";

export interface ForecastLikelihood {
  verdict: "True" | "False" | "Inconclusive";
  probabilityPercent: number;
  confidence: "low" | "medium" | "high";
  narrative: string;
}

export interface ForecastDriver {
  title: string;
  direction: ForecastDirection;
  detail: string;
}

export interface CounterSignal {
  title: string;
  detail: string;
}

export interface ScenarioBreakdown {
  name: string;
  probabilityPercent: number;
  summary: string;
}

export interface MonitoringItem {
  item: string;
  why: string;
  action: string;
}

export interface RecommendedSource {
  title: string;
  url: string;
  insight: string;
}

export interface ForecastAnalysis {
  question: string;
  likelihood: ForecastLikelihood;
  shortSummary: string;
  keyDrivers: ForecastDriver[];
  counterSignals: CounterSignal[];
  scenarios: ScenarioBreakdown[];
  monitoring: MonitoringItem[];
  recommendedSources: RecommendedSource[];
  timeHorizon: string;
  updatedAt: string;
}

export interface ForecastRequestPayload {
  question: string;
  context?: string;
}

export interface ForecastResponsePayload {
  analysis?: ForecastAnalysis;
  error?: string;
}
