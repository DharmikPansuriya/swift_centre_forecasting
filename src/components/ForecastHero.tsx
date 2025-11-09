import type { ForecastAnalysis } from "../sharedTypes";
import PointList from "./PointList";
import { splitIntoPoints } from "../lib/text";

export type MetricChip = {
  label: string;
  value: string;
  variant?: string;
};

type ForecastHeroProps = {
  analysis: ForecastAnalysis;
  chips: MetricChip[];
  showNarrative: boolean;
  narrativeText?: string;
  updatedAtLabel: string;
  onExportPdf?: () => void;
};

export default function ForecastHero({
  analysis,
  chips,
  showNarrative,
  narrativeText,
  updatedAtLabel,
  onExportPdf,
}: ForecastHeroProps) {
  const verdict = analysis.likelihood.verdict.toLowerCase();
  const summaryPoints = splitIntoPoints(analysis.shortSummary);
  const verdictStyles: Record<string, string> = {
    true: "bg-gradient-to-tr from-[#1fbf83] to-[#0a7b53] text-[#f5fffb]",
    false: "bg-gradient-to-tr from-[#f35b5b] to-[#b71c1c] text-[#fff5f5]",
    inconclusive:
      "bg-gradient-to-tr from-[#ffd56f] to-[#c18c1d] text-[#2b2208]",
  };

  const chipStyles: Record<string, string> = {
    "confidence-low":
      "border-[rgba(235,186,63,0.24)] bg-[rgba(235,186,63,0.16)] text-[#7a4d07]",
    "confidence-medium":
      "border-[rgba(76,98,255,0.26)] bg-[rgba(76,98,255,0.14)] text-[#1f2a5f]",
    "confidence-high":
      "border-[rgba(15,138,95,0.26)] bg-[rgba(15,138,95,0.16)] text-[#0f5f3c]",
    probability:
      "border-[rgba(76,98,255,0.28)] bg-[rgba(76,98,255,0.18)] text-[#1f2a5f]",
    time: "border-[rgba(180,123,255,0.24)] bg-[rgba(180,123,255,0.12)] text-[#4c2a8a]",
    question:
      "border-[rgba(11,21,38,0.12)] bg-[rgba(11,21,38,0.08)] text-[#0b1526]/80",
  };

  return (
    <article className="glass-card-highlight">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-[0_12px_25px_-18px_rgba(0,0,0,0.25)] ${
                verdictStyles[verdict] ?? verdictStyles.inconclusive
              }`}
            >
              {analysis.likelihood.verdict}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#0b1526]/55">
              {updatedAtLabel}
            </span>
          </div>
          {onExportPdf && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1f2a5f]/18 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#1f2a5f] shadow-[0_10px_22px_-20px_rgba(31,42,95,0.45)] transition-transform duration-150 ease-out hover:-translate-y-[2px] hover:shadow-[0_16px_32px_-22px_rgba(31,42,95,0.5)] focus:outline-none"
              onClick={onExportPdf}
            >
              <span className="text-base" aria-hidden>
                ⬇️
              </span>
              <span>Export PDF</span>
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-[#0b1526]">
            Key takeaways
          </h2>
          <PointList
            points={
              summaryPoints.length > 0
                ? summaryPoints
                : [analysis.shortSummary].filter(Boolean)
            }
            className="ml-5 list-disc space-y-2 text-justify text-[0.98rem] leading-[1.55] text-[#0b1526]/80"
          />
        </div>
        {showNarrative && narrativeText && (
          <PointList
            text={narrativeText}
            className="ml-5 list-disc space-y-2 text-justify text-[0.95rem] leading-[1.55] text-[#0b1526]/75"
          />
        )}
        <div className="flex flex-wrap items-stretch gap-3">
          {chips.map((chip) => {
            const variantClass = chip.variant
              ? chipStyles[chip.variant] ?? ""
              : "";
            return (
              <div
                key={chip.label}
                className={`flex min-w-[160px] flex-col gap-1 rounded-2xl border border-[#4c62ff]/12 bg-white/60 px-4 py-3 text-sm shadow-[0_6px_18px_-14px_rgba(31,42,95,0.25)] backdrop-blur-sm ${variantClass}`}
              >
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#0b1526]/55">
                  {chip.label}
                </span>
                <span className="text-[0.95rem] font-semibold text-[#0b1526]">
                  {chip.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
