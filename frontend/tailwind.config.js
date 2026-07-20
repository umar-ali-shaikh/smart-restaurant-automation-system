/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        dm: ["DM Sans", "sans-serif"],
      },

      colors: {
        primary: "var(--primary)",
        text: "var(--text-main)",
        muted: "var(--text-muted)",
        surface: "var(--bg-surface)",
        background: "var(--bg-main)",
        success: {
          bg: "var(--success-bg)",
          text: "var(--success-text)",
        },
        mesa: {
          bg: "#0a0906",
          surface: "#111009",
          card: "#161411",
          cardAlt: "#1c1814",
          gold: "#d4aa5a",
          cream: "#f5ede0",
          muted: "#8a7d6a",
          text: "#e8dcc8",
          accent: "#c17a3a",
          green: "#4a9a6f",
          red: "#c94040",
          orange: "#e8883a",
          blue: "#5a84e8",
        },
      },
    },
  },
  plugins: [],
};
