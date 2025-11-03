import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "hsl(262 83% 58%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222 47% 11%)",
        primary: { DEFAULT: "hsl(262 83% 58%)", foreground: "hsl(0 0% 100%)" },
        secondary:{ DEFAULT: "hsl(240 4.8% 95.9%)", foreground: "hsl(222 47% 11%)" },
        muted:    { DEFAULT: "hsl(240 4.8% 95.9%)", foreground: "hsl(215 16% 46%)" },
        accent:   { DEFAULT: "hsl(240 4.8% 95.9%)", foreground: "hsl(222 47% 11%)" },
        destructive:{ DEFAULT: "hsl(0 84% 60%)", foreground: "hsl(0 0% 98%)" },
        card:     { DEFAULT: "hsl(0 0% 100%)", foreground: "hsl(222 47% 11%)" },
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
    },
  },
  plugins: [],
} satisfies Config;
