import type { FormEvent, KeyboardEvent } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

type ForecastFormProps = {
  question: string;
  context: string;
  disabled: boolean;
  submitState: SubmitState;
  errorMessage: string | null;
  onQuestionChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onUseSample: () => void;
};

export default function ForecastForm({
  question,
  context,
  disabled,
  submitState,
  errorMessage,
  onQuestionChange,
  onContextChange,
  onSubmit,
  onKeyDown,
  onUseSample,
}: ForecastFormProps) {
  return (
    <section className="card card--input">
      <form onSubmit={onSubmit} className="form-grid">
        <div>
          <label htmlFor="question" className="form-label">
            Forecast question
          </label>
          <textarea
            id="question"
            name="question"
            placeholder="Will..."
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="context" className="form-label">
            Optional context
            <span className="helper-text">
              {" "}
              (recent developments, constraints, data sources)
            </span>
          </label>
          <textarea
            id="context"
            name="context"
            value={context}
            placeholder="Share recent developments, relevant data, or framing notes."
            onChange={(event) => onContextChange(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            rows={4}
          />
        </div>

        {submitState === "error" && errorMessage && (
          <div className="alert alert--error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="form-footer">
          <span className="shortcut-hint">
            Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit
          </span>
          <div className="button-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onUseSample}
              disabled={disabled}
            >
              <span className="btn-icon" aria-hidden>
                🧪
              </span>
              <span>Use sample question</span>
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={disabled}
            >
              <span className="btn-icon" aria-hidden>
                {submitState === "loading" ? "🔄" : "🚀"}
              </span>
              <span>
                {submitState === "loading"
                  ? "Generating analysis…"
                  : "Generate analysis"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
