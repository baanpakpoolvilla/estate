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
        navy: "#0B1F3B",
        blue: "#1E88E5",
        "blue-light": "#42A5F5",
        offwhite: "#F5F7FA",
      },
      fontFamily: {
        sarabun: ["var(--font-sarabun)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
