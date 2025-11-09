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
    <section className="relative">
      <div className="rounded-[26px] bg-input-border p-[3px]">
        <div className="glass-card">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="question"
                className="text-sm font-semibold text-[#0b1526]/80"
              >
                Forecast question
              </label>
              <textarea
                id="question"
                name="question"
                placeholder="Will the U.S. military..."
                value={question}
                onChange={(event) => onQuestionChange(event.target.value)}
                onKeyDown={onKeyDown}
                disabled={disabled}
                rows={4}
                className="w-full rounded-2xl border border-[#0b1526]/10 bg-white/90 px-5 py-4 text-base leading-relaxed text-[#0b1526] shadow-[0_6px_18px_-12px_rgba(31,42,95,0.25)] outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-[#eff2f9]/70 disabled:text-[#0b1526]/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="context"
                className="text-sm font-semibold text-[#0b1526]/80"
              >
                Optional context
                <span className="ml-1 text-xs font-normal text-[#0b1526]/55">
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
                className="w-full rounded-2xl border border-[#0b1526]/10 bg-white/90 px-5 py-4 text-base leading-relaxed text-[#0b1526] shadow-[0_6px_18px_-12px_rgba(31,42,95,0.25)] outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:bg-[#eff2f9]/70 disabled:text-[#0b1526]/50"
              />
            </div>

            {submitState === "error" && errorMessage && (
              <div
                className="rounded-xl border border-[#ff6666]/35 bg-[#ff6666]/15 px-4 py-3 text-sm text-[#913030]"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-[#0b1526]/55">
                Press{" "}
                <kbd className="rounded-lg bg-[#0b1526]/10 px-2 py-1 text-xs font-semibold text-[#0b1526] shadow-inner">
                  ⌘
                </kbd>
                /
                <kbd className="rounded-lg bg-[#0b1526]/10 px-2 py-1 text-xs font-semibold text-[#0b1526] shadow-inner">
                  Ctrl
                </kbd>
                +{" "}
                <kbd className="rounded-lg bg-[#0b1526]/10 px-2 py-1 text-xs font-semibold text-[#0b1526] shadow-inner">
                  Enter
                </kbd>{" "}
                to submit
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={onUseSample}
                  disabled={disabled}
                >
                  <span className="text-lg" aria-hidden>
                    🧪
                  </span>
                  <span>Use sample question</span>
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={disabled}
                >
                  <span className="text-lg" aria-hidden>
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
        </div>
      </div>
    </section>
  );
}
