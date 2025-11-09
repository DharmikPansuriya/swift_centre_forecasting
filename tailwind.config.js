/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1526",
        "ink-soft": "rgba(11, 21, 38, 0.75)",
        "ink-muted": "rgba(11, 21, 38, 0.55)",
        "ink-subtle": "rgba(11, 21, 38, 0.45)",
        brand: "#4c62ff",
        "brand-soft": "#7b9dff",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 20px 45px -25px rgba(19, 33, 68, 0.45)",
        "card-soft": "0 12px 28px -16px rgba(69, 110, 255, 0.7)",
        "card-hover": "0 16px 34px -16px rgba(69, 110, 255, 0.75)",
        "card-secondary": "0 10px 24px -18px rgba(31, 42, 95, 0.55)",
        "card-secondary-hover": "0 18px 38px -20px rgba(31, 42, 95, 0.6)",
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(circle at top left, rgba(69, 110, 255, 0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(117, 200, 255, 0.25), transparent 50%), #eef2f9",
        "card-highlight":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 246, 255, 0.9))",
        "input-border":
          "linear-gradient(135deg, rgba(69, 110, 255, 0.35), rgba(255, 135, 135, 0.3))",
      },
    },
  },
  plugins: [],
};
