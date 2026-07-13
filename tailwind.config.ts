import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        legal: {
          ink: "#07111f",
          obsidian: "#050b14",
          navy: "#0b1f3a",
          blue: "#2557d6",
          royal: "#1d4ed8",
          cyan: "#0e7490",
          line: "#dfe7f1",
          surface: "#f5f7fb",
          gold: "#b7791f",
          paper: "#fbfcff"
        }
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.08)",
        panel: "0 1px 2px rgba(15, 23, 42, 0.06), 0 18px 42px rgba(15, 23, 42, 0.06)",
        executive: "0 1px 0 rgba(255,255,255,0.65) inset, 0 24px 70px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
