import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F7FB",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#0E1116",
          soft: "#2A2F3A",
        },
        muted: "#616B7C",
        line: "#E7E9F0",
        accent: {
          DEFAULT: "#5B5BD6",
          // ВНИМАНИЕ: токен `accent.soft` намеренно удалён.
          // Он генерировал класс `.bg-accent-soft` с насыщенным цветом #7A6CF0,
          // который конфликтовал с мягким градиентом `backgroundImage["accent-soft"]`
          // ниже — и побеждал, превращая задуманную светлую лаванду в кричащий
          // фиолет с нечитаемым тёмным текстом. Мягкий фон даёт только градиент.
          ink: "#3D3DAE",
        },
        money: {
          DEFAULT: "#0EA88E",
          ink: "#0B8472",
          soft: "#E6F7F3",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(16,17,22,.06)",
        card: "0 12px 40px rgba(16,17,22,.08)",
        lift: "0 24px 60px rgba(91,91,214,.18)",
        glow: "0 18px 50px rgba(91,91,214,.28)",
      },
      backgroundImage: {
        "accent-grad": "linear-gradient(135deg, #5B5BD6 0%, #7A6CF0 100%)",
        "accent-soft": "linear-gradient(135deg, rgba(91,91,214,.14) 0%, rgba(122,108,240,.12) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-22px) rotate(-2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
