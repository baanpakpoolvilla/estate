import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
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
      screens: {
        xs: "375px",
        tablet: "834px",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
