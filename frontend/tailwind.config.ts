import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fundo preto profundo (base do design system)
        background: {
          DEFAULT: "#050607",
          surface: "#0D0F11",
          elevated: "#15181B",
        },
        // Verde esmeralda como cor de destaque primária
        emerald: {
          DEFAULT: "#00C896",
          soft: "#04D9A0",
          dim: "#0A3B30",
        },
        // Azul como cor de destaque secundária
        azure: {
          DEFAULT: "#2E6BFF",
          soft: "#5C8CFF",
          dim: "#0E1C42",
        },
        line: "#1F2327",
        muted: "#8A9099",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(0, 200, 150, 0.45)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, #050607), radial-gradient(circle at 50% 0%, rgba(0,200,150,0.12), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
