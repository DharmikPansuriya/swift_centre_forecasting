import type { ForecastAnalysis } from "../sharedTypes";

type ProbabilityGaugeProps = {
  value: number;
  verdict: ForecastAnalysis["likelihood"]["verdict"];
};

export default function ProbabilityGauge({
  value,
  verdict,
}: ProbabilityGaugeProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  const verdictCopy =
    verdict === "True"
      ? "Favors True"
      : verdict === "False"
      ? "Favors False"
      : "Outcome Unclear";

  return (
    <div
      className="probability-dial"
      title={`${safeValue.toFixed(1)}% · ${verdictCopy}`}
    >
      <svg
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Probability ${safeValue.toFixed(1)} percent`}
      >
        <defs>
          <linearGradient
            id="probabilityGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4c62ff" />
            <stop offset="100%" stopColor="#7b9dff" />
          </linearGradient>
        </defs>
        <circle
          className="probability-dial__track"
          cx="80"
          cy="80"
          r={radius}
        />
        <circle
          className="probability-dial__progress"
          cx="80"
          cy="80"
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}
