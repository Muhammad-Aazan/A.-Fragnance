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
        bg: "#090909",
        gold: "#c6a56b",
        "gold-dark": "#504733",
        "gold-mid": "#5a4d36",
        cream: "#f3eee5",
        muted: "#aba69d",
        line: "#28241d",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
        "extra-wide": "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
