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
    <div className="mx-auto flex min-h-screen max-w-[1320px] flex-col gap-10 px-6 pb-12 pt-10 lg:px-10 xl:px-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#0b1526]/60">
            Swift Centre · Forecast toolkit
          </p>
          <h1 className="text-4xl font-semibold text-[#0b1526] lg:text-[2.75rem] lg:leading-[1.1]">
            Forecast Question Analysis
          </h1>
          <p className="text-base text-[#0b1526]/75 lg:text-[1.05rem]">
            Ask a binary (true/false) forecasting question and get a structured
            briefing, probability estimate, and signals to monitor before
            committing to a forecast.
          </p>
        </div>
      </header>

      <main className="grid gap-8 lg:gap-10">
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
          <section className="flex flex-col gap-7 lg:gap-8">
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

      <footer className="mt-auto text-center text-sm text-[#0b1526]/55">
        <p>
          Analysis powered by Gemini 2.5 Flash. Remember to sanity check outputs
          and validate sources before using in production forecasts.
        </p>
      </footer>
    </div>
  );
}

export default App;
