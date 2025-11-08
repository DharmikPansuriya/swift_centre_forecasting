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
    <div className="analysis-columns">
      <div className="analysis-column">
        <article className="card section-card">
          <div className="section-card__header">
            <h3>Primary drivers</h3>
            <p>Signals that weigh most heavily on the forecast direction.</p>
          </div>
          {analysis.keyDrivers.length ? (
            <table className="analysis-table analysis-table--drivers">
              <thead>
                <tr>
                  <th scope="col" className="analysis-table__col--signal">
                    Signal
                  </th>
                  <th scope="col" className="analysis-table__col--direction">
                    Direction
                  </th>
                  <th scope="col" className="analysis-table__col--detail">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.keyDrivers.map((driver) => (
                  <tr key={driver.title}>
                    <td className="analysis-table__title analysis-table__col--signal">
                      {driver.title}
                    </td>
                    <td className="analysis-table__col--direction">
                      <span
                        className={`direction direction--${driver.direction}`}
                      >
                        {driver.direction === "increase"
                          ? "Strengthens true"
                          : driver.direction === "decrease"
                          ? "Pushes false"
                          : "Mixed effect"}
                      </span>
                    </td>
                    <td className="analysis-table__col--detail">
                      <PointList
                        text={driver.detail}
                        className="point-list--table"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-hint">No dominant drivers highlighted.</p>
          )}
        </article>

        <article className="card section-card">
          <div className="section-card__header">
            <h3>Scenario outlook</h3>
            <p>
              Possible pathways with the model&apos;s probability distribution.
            </p>
          </div>
          {analysis.scenarios.length ? (
            <table className="analysis-table analysis-table--scenarios">
              <thead>
                <tr>
                  <th scope="col" className="analysis-table__col--signal">
                    Scenario
                  </th>
                  <th scope="col" className="analysis-table__col--direction">
                    Probability
                  </th>
                  <th scope="col" className="analysis-table__col--detail">
                    Summary
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.scenarios.map((scenario) => (
                  <tr key={scenario.name}>
                    <td className="analysis-table__title analysis-table__col--signal">
                      {scenario.name}
                    </td>
                    <td className="analysis-table__col--direction">
                      <span
                        className={`probability-pill ${
                          scenario.probabilityPercent >= 50
                            ? "probability-pill--high"
                            : "probability-pill--low"
                        }`}
                      >
                        {scenario.probabilityPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="analysis-table__col--detail">
                      <PointList
                        text={scenario.summary}
                        className="point-list--table"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-hint">
              The model did not outline explicit scenarios.
            </p>
          )}
        </article>
      </div>

      <div className="analysis-column">
        <article className="card section-card">
          <div className="section-card__header">
            <h3>Counter signals</h3>
            <p>Factors that could undermine the leading narrative.</p>
          </div>
          {analysis.counterSignals.length ? (
            <table className="analysis-table analysis-table--counter">
              <thead>
                <tr>
                  <th scope="col" className="analysis-table__col--signal">
                    Signal
                  </th>
                  <th scope="col" className="analysis-table__col--detail">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.counterSignals.map((counter) => (
                  <tr key={counter.title}>
                    <td className="analysis-table__title analysis-table__col--signal">
                      {counter.title}
                    </td>
                    <td className="analysis-table__col--detail">
                      <PointList
                        text={counter.detail}
                        className="point-list--table"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-hint">No countervailing evidence emphasised.</p>
          )}
        </article>

        <article className="card section-card">
          <div className="section-card__header">
            <h3>Signals to monitor</h3>
            <p>Short checklist to track as the situation evolves.</p>
          </div>
          {analysis.monitoring.length ? (
            <table className="analysis-table analysis-table--monitoring">
              <thead>
                <tr>
                  <th scope="col" className="analysis-table__col--signal">
                    Signal
                  </th>
                  <th scope="col" className="analysis-table__col--monitor-why">
                    Why it matters
                  </th>
                  <th
                    scope="col"
                    className="analysis-table__col--monitor-action"
                  >
                    Suggested action
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.monitoring.map((item) => (
                  <tr key={item.item}>
                    <td className="analysis-table__title analysis-table__col--signal">
                      {item.item}
                    </td>
                    <td className="analysis-table__col--monitor-why">
                      <PointList
                        text={item.why}
                        className="point-list--table"
                      />
                    </td>
                    <td className="action-cell analysis-table__col--monitor-action">
                      <PointList
                        text={item.action}
                        className="point-list--table point-list--compact"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-hint">No monitoring guidance provided.</p>
          )}
        </article>

        <article className="card section-card">
          <div className="section-card__header">
            <h3>Suggested sources</h3>
            <p>Starting points for manual follow-up and validation.</p>
          </div>
          {analysis.recommendedSources.length ? (
            <table className="analysis-table analysis-table--sources">
              <thead>
                <tr>
                  <th scope="col" className="analysis-table__col--signal">
                    Source
                  </th>
                  <th scope="col" className="analysis-table__col--detail">
                    Insight
                  </th>
                </tr>
              </thead>
              <tbody>
                {analysis.recommendedSources.map((source) => {
                  const hostname = extractHostname(source.url);
                  return (
                    <tr key={source.url}>
                      <td className="analysis-table__title analysis-table__col--signal">
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {source.title}
                        </a>
                      </td>
                      <td className="analysis-table__col--detail">
                        <PointList
                          text={source.insight}
                          className="point-list--table"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="empty-hint">No external sources were cited.</p>
          )}
        </article>
      </div>
    </div>
  );
}
