/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#202A44",
        indigo: {
          DEFAULT: "#465EBA",
          dark: "#364B9A",
          soft: "#EEF1FA",
        },
        canvas: "#F7F7F4",
        ink: "#202124",
        muted: "#6B7280",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
      DEFAULT: "6px",
      md: "8px",
      lg: "10px",
    },
    },
    
  },
  plugins: [],
};