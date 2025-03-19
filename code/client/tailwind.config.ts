import type { Config } from "tailwindcss";

const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // user can dynamically configure these
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blurple: "var(--blurple)",
        purple: "var(--purple)",
        "background-hover": "var(--background-hover)",
        "foreground-hover": "var(--foreground-hover)",
        "blurple-hover": "var(--blurple-hover)",
        "purple-hover": "var(--purple-hover)",
        "button-color": "var(--button-color)",
        "text-color": "var(--text-color)",
        primary: colors.gray[900],
        secondary: colors.blue[500],
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
