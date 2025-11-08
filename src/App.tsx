import "./index.css";
import ForecastForm from "./components/ForecastForm";
import ForecastHero from "./components/ForecastHero";
import AnalysisTables from "./components/AnalysisTables";
import { useForecastWorkflow } from "./hooks/useForecastWorkflow";

export function App() {
  const {
    question,
    context,
    analysis,
    submitState,
    errorMessage,
    disabled,
    chipMetrics,
    showNarrative,
    narrativeText,
    updatedAtLabel,
    handleQuestionChange,
    handleContextChange,
    handleUseSample,
    handleSubmit,
    handleKeyDown,
    extractHostname,
    handleExportPdf,
  } = useForecastWorkflow();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Swift Centre · Forecast toolkit</p>
          <h1>Forecast Question Analysis</h1>
          <p className="subtitle">
            Ask a binary (true/false) forecasting question and get a structured
            briefing, probability estimate, and signals to monitor before
            committing to a forecast.
          </p>
        </div>
      </header>

      <main className="content-grid">
        <ForecastForm
          question={question}
          context={context}
          disabled={disabled}
          submitState={submitState}
          errorMessage={errorMessage}
          onQuestionChange={handleQuestionChange}
          onContextChange={handleContextChange}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onUseSample={handleUseSample}
        />

        {analysis && (
          <section className="analysis-shell">
            <ForecastHero
              analysis={analysis}
              chips={chipMetrics}
              showNarrative={showNarrative}
              narrativeText={narrativeText}
              updatedAtLabel={updatedAtLabel}
              onExportPdf={handleExportPdf}
            />
            <AnalysisTables
              analysis={analysis}
              extractHostname={extractHostname}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Analysis powered by Gemini 2.5 Flash. Remember to sanity check outputs
          and validate sources before using in production forecasts.
        </p>
      </footer>
    </div>
  );
}

export default App;
