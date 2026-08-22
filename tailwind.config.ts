import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        luoi: {
          orange: "#FF8A3D",
          orangeDark: "#E76F51",
          orangeBorder: "#C84B31",
          green: "#4CAF50",
          greenDark: "#2E7D32",
          greenBorder: "#1B5E20",
          sky: "#44B5E2",
          skyDark: "#0284C7",
          skyBorder: "#0369A1",
          yellow: "#FFD166",
          yellowDark: "#F59E0B",
          yellowBorder: "#B45309",
          purple: "#8B5CF6",
          purpleDark: "#7C3AED",
          purpleBorder: "#5B21B6",
          gold: "#FFC747",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        baloo: ["var(--font-baloo)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0, 0, 0, 0.06)",
        card: "0 12px 28px -6px var(--card-shadow, rgba(0, 0, 0, 0.08)), 0 6px 12px -4px var(--card-shadow, rgba(0, 0, 0, 0.04))",
        clay: "0 16px 32px -8px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -4px 6px rgba(0, 0, 0, 0.06)",
        float: "0 20px 35px -10px rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(255, 209, 102, 0.6)",
        "3d-orange": "0 6px 0 #C84B31, 0 10px 15px rgba(255, 111, 89, 0.35)",
        "3d-green": "0 6px 0 #1B5E20, 0 10px 15px rgba(76, 175, 80, 0.35)",
        "3d-blue": "0 6px 0 #0369A1, 0 10px 15px rgba(68, 181, 226, 0.35)",
        "3d-yellow": "0 6px 0 #B45309, 0 10px 15px rgba(255, 209, 102, 0.4)",
        "3d-purple": "0 6px 0 #5B21B6, 0 10px 15px rgba(139, 92, 246, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
