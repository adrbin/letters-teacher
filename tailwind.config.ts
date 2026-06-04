import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ["Nunito", "ui-rounded", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 55, 0.14)"
      }
    }
  },
  plugins: []
} satisfies Config;
