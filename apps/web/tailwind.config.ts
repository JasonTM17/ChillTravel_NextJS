import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#071827",
        teal: "#0F8B7B",
        sunset: "#F97316",
        ivory: "#F8F3EA",
        mist: "#DCEFF3"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15,139,123,0.24)"
      }
    }
  },
  plugins: []
};

export default config;
