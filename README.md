# Forecast Question Analysis

Forecast Question Analysis is a Bun + React application that helps forecasters explore binary (true/false) questions. Enter a question—optionally include context—and the app calls Gemini 2.5 Flash to generate:

- A headline verdict with probability, confidence, and time horizon
- Structured explanations of primary drivers, counter signals, scenarios, monitoring items
- Suggested sources for follow-up research
- A shareable PDF briefing that mirrors the on-screen summary

Everything is designed for an intranet deployment: no authentication, no external state, just a lightweight Bun server that validates input, calls Gemini, and returns the structured response.

## Quick Start

```bash
# install dependencies
bun install

# run in development (hot reload for server + client)
bun dev

# optional: production bundle
bun run build
# start the production server locally
bun start
```

You will need a Gemini API key. Create one in Google AI Studio and expose it as `GEMINI_KEY` before running the server:

```bash
export GEMINI_KEY=your-google-ai-key
```

Bun automatically loads `.env` files, so you can also place the key in `.env` if preferred.

## Architecture

```
src/
├── index.ts                  # Bun server + routes
├── schemas/forecastRequest.ts# Zod validation schema
├── services/geminiForecast.ts# Gemini 2.5 Flash integration + normalization
├── routes/forecastRoute.ts   # /api/forecast route factory
├── hooks/useForecastWorkflow.ts # Client workflow hook (state + handlers)
├── components/               # UI components (forms, tables, hero, gauge)
├── lib/                      # Shared utilities (API, dates, text, PDF)
├── App.tsx                   # App shell composing components
├── frontend.tsx              # React entry point
└── index.css                 # Styling system
```

- **Backend:** `src/index.ts` uses `Bun.serve` to expose `/api/forecast`. Requests are validated with Zod (`schemas/forecastRequest.ts`), forwarded to Gemini 2.5 Flash via the official SDK (`services/geminiForecast.ts`), retried when necessary, then normalized for the UI.
- **Frontend:** `src/App.tsx` renders the analyst console using modular components:
  - `ForecastForm` for input, including sample question helpers and keyboard shortcuts
  - `ForecastHero` for verdict, probability gauge, and PDF export button
  - `AnalysisTables` for primary drivers, scenarios, counter signals, monitoring signals, and sources
  - `PointList`, `ProbabilityGauge`, and shared hooks/utilities to keep logic tidy
- **Styling:** `src/index.css` provides a custom design system (chips, dashboards, tables, gradients). Only default CSS is used—no third-party UI framework.
- **PDF Export:** `lib/pdf.ts` + `jspdf`/`jspdf-autotable` generate a well-formatted briefing with justified text, tables, and section dividers. Triggered via the “Export PDF” button in the hero.

## Development Notes

- Logging is enabled on both client and server to trace request flow and API responses.
- The app assumes trusted intranet usage; there is no authentication layer.
- Narrative text is deduplicated if it repeats the short summary.
- Tables and badges are color-coded for quick scanning (green strengthens true, red pushes false, etc.).

## License

MIT. See `LICENSE` if provided, or adapt to your organization’s standard. This project was bootstrapped with `bun init` (Bun v1.3.2). Continuous improvements are welcome—submit PRs or fork and extend.
