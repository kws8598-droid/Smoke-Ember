import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f160d",
        ember: "#c45c26",
        "ember-hot": "#e07a3d",
        cream: "#f3ead8",
        parchment: "#d7cbb3",
        bark: "#2b2015",
        ash: "#3e3022",
        subtle: "#9a8b78",
        paper: "#f3ead8",
        fg: "#f3ead8",
        bg: "#1f160d",
        elevated: "#382b1c",
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
