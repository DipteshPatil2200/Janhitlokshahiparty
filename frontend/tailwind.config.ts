import type { Config } from "tailwindcss";

// =============================================================
// JANHIT LOKSHAHI PARTY — DESIGN SYSTEM
// -------------------------------------------------------------
// Visual identity derived from the party logo:
//   Saffron / orange  -> primary brand accent & CTA
//   Deep green        -> secondary brand color & strong sections
//   Warm white        -> main page canvas
//   Charcoal          -> headings, body text, navigation
//   Gold              -> subtle premium accent
//
// The `brand` palette is the global accent used by buttons, active
// navigation, icons, eyebrows and links. It is intentionally mapped
// to SAFRONG/ORANGE so the entire app follows the party identity
// without scattering hex values across components.
//
// Official logo/photo files are NOT yet in the repo. Add them under
// `frontend/public/brand/` (logo.png / logo.svg / photos) and they
// will be picked up automatically by the Logo and SmartImage
// components.
// =============================================================

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // ---- Party identity tokens (official logo reference) ----
        party: {
          saffron: "#E97800",
          orange: "#F28C00",
          gold: "#F5B400",
          green: "#315B20",
          "green-dark": "#1F4018",
          white: "#FFFFFF",
          "off-white": "#FAF8F3",
          black: "#151515",
          charcoal: "#252525",
        },
        // ---- Primary brand accent = SAFFRON / ORANGE ----
        brand: {
          50: "#FEF3E7",
          100: "#FDE4C8",
          200: "#FBC98F",
          300: "#F7A94E",
          400: "#F28C00",
          500: "#E97800",
          600: "#D46200",
          700: "#B15000",
          800: "#8E4200",
          900: "#6B3200",
          950: "#3F1D00",
        },
        // ---- Secondary brand color = DEEP GREEN ----
        green: {
          50: "#F0F5EE",
          100: "#DCE9D8",
          200: "#BBD2B3",
          300: "#94B688",
          400: "#6C9A5E",
          500: "#4C7D3E",
          600: "#3A662E",
          700: "#315B20",
          800: "#264A19",
          900: "#1F4018",
          950: "#12290E",
        },
        // ---- Gold / subtle accent ----
        gold: {
          DEFAULT: "#F5B400",
          light: "#FFD666",
          dark: "#C98D00",
        },
        // ---- Warm neutral canvas & text ----
        paper: "#FAF8F3",
        "off-white": "#FAF8F3",
        ink: {
          DEFAULT: "#1C1A17",
          soft: "#44403B",
          muted: "#6B665F",
          faint: "#8A857C",
        },
        border: "#E9E2D6",
        "border-strong": "#D8CFC0",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "Noto Sans Devanagari",
          "sans-serif",
        ],
        marathi: [
          "var(--font-mukta)",
          "Mukta",
          "Noto Sans Devanagari",
          "sans-serif",
        ],
        display: [
          "var(--font-inter)",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem,6vw,4.25rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.375rem,4.5vw,3rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.875rem,3.5vw,2.375rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        "content": "1280px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(21 21 21 / 0.05)",
        elevated: "0 14px 40px -12px rgb(21 21 21 / 0.18)",
        "ring-saffron": "0 0 0 3px rgb(242 140 0 / 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "fade-up-slow": "fadeUp 0.8s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
