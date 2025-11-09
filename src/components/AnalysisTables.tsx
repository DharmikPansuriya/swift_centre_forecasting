import type { ForecastAnalysis } from "../sharedTypes";
import PointList from "./PointList";

type AnalysisTablesProps = {
  analysis: ForecastAnalysis;
  extractHostname: (url: string) => string;
};

export default function AnalysisTables({
  analysis,
  extractHostname,
}: AnalysisTablesProps) {
  return (
    <div className="grid gap-7 xl:grid-cols-2 xl:items-start">
      <div className="flex flex-col gap-7">
        <article className="glass-card">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#0b1526]">
              Primary drivers
            </h3>
            <p className="text-sm text-[#0b1526]/60">
              Signals that weigh most heavily on the forecast direction.
            </p>
          </div>
          {analysis.keyDrivers.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.95rem]">
                <thead className="bg-[#0b1526]/5">
                  <tr className="text-[0.78rem] uppercase tracking-[0.12em] text-[#0b1526]/65">
                    <th scope="col" className="w-[20%] px-4 py-3 text-left">
                      Signal
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-3 text-left">
                      Direction
                    </th>
                    <th scope="col" className="w-[60%] px-4 py-3 text-left">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.keyDrivers.map((driver) => {
                    const directionClasses: Record<string, string> = {
                      increase: "bg-[rgba(15,138,95,0.15)] text-[#0f5f3c]",
                      decrease: "bg-[rgba(185,49,49,0.18)] text-[#7f1f1f]",
                      uncertain: "bg-[rgba(26,76,170,0.12)] text-[#1a3d7a]",
                    };
                    const directionLabel =
                      driver.direction === "increase"
                        ? "Strengthens true"
                        : driver.direction === "decrease"
                        ? "Pushes false"
                        : "Mixed effect";
                    return (
                      <tr
                        key={driver.title}
                        className="border-b border-[#0b1526]/10"
                      >
                        <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1526]">
                          {driver.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] ${
                              directionClasses[driver.direction]
                            }`}
                          >
                            {directionLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <PointList
                            text={driver.detail}
                            className="space-y-[0.35rem] text-[0.93rem] text-[#0b1526]/75"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#0b1526]/5 px-4 py-3 text-sm text-[#0b1526]/55">
              No dominant drivers highlighted.
            </p>
          )}
        </article>

        <article className="glass-card">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#0b1526]">
              Scenario outlook
            </h3>
            <p className="text-sm text-[#0b1526]/60">
              Possible pathways with the model&apos;s probability distribution.
            </p>
          </div>
          {analysis.scenarios.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.95rem]">
                <thead className="bg-[#0b1526]/5">
                  <tr className="text-[0.78rem] uppercase tracking-[0.12em] text-[#0b1526]/65">
                    <th scope="col" className="w-[20%] px-4 py-3 text-left">
                      Scenario
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-3 text-left">
                      Probability
                    </th>
                    <th scope="col" className="w-[60%] px-4 py-3 text-left">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.scenarios.map((scenario) => (
                    <tr
                      key={scenario.name}
                      className="border-b border-[#0b1526]/10"
                    >
                      <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1526]">
                        {scenario.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex min-w-[70px] items-center justify-center rounded-full px-3 py-1 text-[0.85rem] font-semibold tracking-[0.05em] ${
                            scenario.probabilityPercent >= 50
                              ? "bg-[rgba(15,138,95,0.16)] text-[#0f5f3c]"
                              : "bg-[rgba(185,49,49,0.16)] text-[#7f1f1f]"
                          }`}
                        >
                          {scenario.probabilityPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <PointList
                          text={scenario.summary}
                          className="space-y-[0.35rem] text-[0.93rem] text-[#0b1526]/75"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#0b1526]/5 px-4 py-3 text-sm text-[#0b1526]/55">
              The model did not outline explicit scenarios.
            </p>
          )}
        </article>
      </div>

      <div className="flex flex-col gap-7">
        <article className="glass-card">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#0b1526]">
              Counter signals
            </h3>
            <p className="text-sm text-[#0b1526]/60">
              Factors that could undermine the leading narrative.
            </p>
          </div>
          {analysis.counterSignals.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.95rem]">
                <thead className="bg-[#0b1526]/5">
                  <tr className="text-[0.78rem] uppercase tracking-[0.12em] text-[#0b1526]/65">
                    <th scope="col" className="w-[30%] px-4 py-3 text-left">
                      Signal
                    </th>
                    <th scope="col" className="w-[70%] px-4 py-3 text-left">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.counterSignals.map((counter) => (
                    <tr
                      key={counter.title}
                      className="border-b border-[#0b1526]/10"
                    >
                      <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1526]">
                        {counter.title}
                      </td>
                      <td className="px-4 py-3">
                        <PointList
                          text={counter.detail}
                          className="space-y-[0.35rem] text-[0.93rem] text-[#0b1526]/75"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#0b1526]/5 px-4 py-3 text-sm text-[#0b1526]/55">
              No countervailing evidence emphasised.
            </p>
          )}
        </article>

        <article className="glass-card">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#0b1526]">
              Signals to monitor
            </h3>
            <p className="text-sm text-[#0b1526]/60">
              Short checklist to track as the situation evolves.
            </p>
          </div>
          {analysis.monitoring.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.95rem]">
                <thead className="bg-[#0b1526]/5">
                  <tr className="text-[0.78rem] uppercase tracking-[0.12em] text-[#0b1526]/65">
                    <th scope="col" className="w-[20%] px-4 py-3 text-left">
                      Signal
                    </th>
                    <th scope="col" className="w-[40%] px-4 py-3 text-left">
                      Why it matters
                    </th>
                    <th scope="col" className="w-[40%] px-4 py-3 text-left">
                      Suggested action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.monitoring.map((item) => (
                    <tr
                      key={item.item}
                      className="border-b border-[#0b1526]/10"
                    >
                      <td className="max-w-[220px] px-4 py-3 font-semibold text-[#0b1526]">
                        {item.item}
                      </td>
                      <td className="px-4 py-3">
                        <PointList
                          text={item.why}
                          className="space-y-[0.35rem] text-[0.93rem] text-[#0b1526]/75"
                        />
                      </td>
                      <td className="px-4 py-3 italic text-[#0b1526]/75">
                        <PointList
                          text={item.action}
                          className="space-y-[0.2rem] text-[0.93rem] text-[#0b1526]/75 [&>li]:italic"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#0b1526]/5 px-4 py-3 text-sm text-[#0b1526]/55">
              No monitoring guidance provided.
            </p>
          )}
        </article>

        <article className="glass-card">
          <div className="mb-5 flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-[#0b1526]">
              Suggested sources
            </h3>
            <p className="text-sm text-[#0b1526]/60">
              Starting points for manual follow-up and validation.
            </p>
          </div>
          {analysis.recommendedSources.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.95rem]">
                <thead className="bg-[#0b1526]/5">
                  <tr className="text-[0.78rem] uppercase tracking-[0.12em] text-[#0b1526]/65">
                    <th scope="col" className="w-[35%] px-4 py-3 text-left">
                      Source
                    </th>
                    <th scope="col" className="w-[65%] px-4 py-3 text-left">
                      Insight
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.recommendedSources.map((source) => {
                    const hostname = extractHostname(source.url);
                    return (
                      <tr
                        key={source.url}
                        className="border-b border-[#0b1526]/10"
                      >
                        <td className="px-4 py-3">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[#274cdb] hover:underline"
                          >
                            {source.title}
                          </a>
                          {hostname && (
                            <span className="mt-1 block text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#0b1526]/45">
                              {hostname}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <PointList
                            text={source.insight}
                            className="space-y-[0.35rem] text-[0.93rem] text-[#0b1526]/75"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 rounded-xl bg-[#0b1526]/5 px-4 py-3 text-sm text-[#0b1526]/55">
              No external sources were cited.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
