/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kard: {
          orange: "#E07020",
          "orange-hover": "#c85e18",
          bg: "#0a0a0a",
          surface: "#141414",
          border: "#1e1e1e",
          muted: "#2a2a2a",
          text: "#f0f0f0",
          subtle: "#555",
          faint: "#333",
        },
      },
      borderRadius: {
        kard: "22px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
