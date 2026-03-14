import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAFAF8",
          100: "#F5F5F0",
        },
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        brand: {
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#6D28D9",
        },
        teal: {
          400: "#2DD4BF",
          500: "#14B8A6",
        },
        subject: {
          math: "#3B82F6",
          reading: "#10B981",
          science: "#F59E0B",
          writing: "#EC4899",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Cal Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
