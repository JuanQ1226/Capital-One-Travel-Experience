import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "selector",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: "#3B82F6",
          secondary: "#9333EA",
          accent: "#FBBF24",
          neutral: "#374151",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        }
      },
      dark: {
        colors: {
          primary: "#3B82F6",
          secondary: "#9333EA",
          accent: "#FBBF24",
          neutral: "#374151",
          "base-100": "#1F2937",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        }
      }
    }
  })],
};

export default config;
