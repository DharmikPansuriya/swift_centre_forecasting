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
      className="flex w-[190px] min-w-[190px] items-center justify-center"
      title={`${safeValue.toFixed(1)}% · ${verdictCopy}`}
    >
      <svg
        viewBox="0 0 160 160"
        role="img"
        className="h-[190px] w-[190px] -rotate-90"
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
          className="fill-none stroke-[rgba(76,98,255,0.08)]"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth={14}
        />
        <circle
          className="fill-none transition-[stroke-dashoffset] duration-500 ease-out"
          cx="80"
          cy="80"
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeWidth={14}
          strokeLinecap="round"
          stroke="url(#probabilityGradient)"
        />
      </svg>
    </div>
  );
}
