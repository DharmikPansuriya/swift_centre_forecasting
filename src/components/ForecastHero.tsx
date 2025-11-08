import type { ForecastAnalysis } from "../sharedTypes";
import ProbabilityGauge from "./ProbabilityGauge";
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

  return (
    <article className="card card--highlight analysis-hero">
      <div className="analysis-hero__content">
        <div className="analysis-hero__row analysis-hero__row--header">
          <div className="analysis-hero__meta">
            <span className={`verdict-badge verdict-badge--${verdict}`}>
              {analysis.likelihood.verdict}
            </span>
            <span className="analysis-hero__timestamp">{updatedAtLabel}</span>
          </div>
          {onExportPdf && (
            <button
              type="button"
              className="btn btn-secondary btn-secondary--ghost"
              onClick={onExportPdf}
            >
              <span className="btn-icon" aria-hidden>
                ⬇️
              </span>
              <span>Export PDF</span>
            </button>
          )}
        </div>
        <div className="analysis-hero__summary">
          <h2>Key takeaways</h2>
          <PointList
            points={
              summaryPoints.length > 0
                ? summaryPoints
                : [analysis.shortSummary].filter(Boolean)
            }
            className="point-list--hero"
          />
        </div>
        {showNarrative && narrativeText && (
          <PointList text={narrativeText} className="point-list--narrative" />
        )}
        <div className="analysis-hero__metrics">
          {chips.map((chip) => (
            <div
              className={`metric-chip${
                chip.variant ? ` metric-chip--${chip.variant}` : ""
              }`}
              key={chip.label}
            >
              <span className="metric-chip__label">{chip.label}</span>
              <span className="metric-chip__value">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <ProbabilityGauge
        value={analysis.likelihood.probabilityPercent}
        verdict={analysis.likelihood.verdict}
      /> */}
    </article>
  );
}
