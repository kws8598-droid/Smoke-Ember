import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171009",
        ember: "#c45c26",
        "ember-hot": "#e07a3d",
        cream: "#f3ead8",
        parchment: "#d7cbb3",
        bark: "#221812",
        ash: "#33261b",
        subtle: "#9a8b78",
        paper: "#f3ead8",
        fg: "#f3ead8",
        bg: "#171009",
        elevated: "#2d2114",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
