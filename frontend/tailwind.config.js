/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        background: "rgb(var(--color-bg) / <alpha-value>)",
        foreground: "rgb(var(--color-fg) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["Sora", "sans-serif"],
        display: ["Cormorant Garamond", "serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(154, 105, 211, 0.18)",
        card: "0 22px 50px rgba(19, 23, 43, 0.08)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
        marquee: "marquee 18s linear infinite"
      }
    }
  },
  plugins: []
};
