import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0907",
        ember: "#c45c26",
        "ember-hot": "#e07a3d",
        cream: "#f3ead8",
        parchment: "#d7cbb3",
        bark: "#1a1410",
        ash: "#2a221c",
        subtle: "#9a8b78",
        paper: "#f3ead8",
        fg: "#f3ead8",
        bg: "#0c0907",
        elevated: "#241c16",
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
