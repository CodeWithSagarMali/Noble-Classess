/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors - PW Skills inspired
        brand: {
          violet: "#7C3AED",
          "violet-light": "#8B5CF6",
          "violet-dark": "#6D28D9",
          orange: "#F97316",
          "orange-light": "#FB923C",
          "orange-dark": "#EA580C",
        },
        surface: {
          DEFAULT: "#0F0F1A",
          "1": "#16162A",
          "2": "#1E1E35",
          "3": "#252540",
          "4": "#2E2E50",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(124, 58, 237, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
        premium: "0 20px 60px -15px rgba(124, 58, 237, 0.12)",
        "premium-orange": "0 20px 60px -15px rgba(249, 115, 22, 0.15)",
        glow: "0 0 30px rgba(124, 58, 237, 0.25)",
        "glow-orange": "0 0 30px rgba(249, 115, 22, 0.25)",
        card: "0 4px 24px rgba(0, 0, 0, 0.12)",
        "card-hover": "0 8px 40px rgba(124, 58, 237, 0.2)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)",
        "gradient-violet": "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
        "gradient-orange": "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F0F1A 0%, #16162A 100%)",
        "gradient-surface": "linear-gradient(180deg, #0F0F1A 0%, #16162A 100%)",
        "gradient-hero": "radial-gradient(ellipse at top left, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(249,115,22,0.1) 0%, transparent 50%)",
        "gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "gradient-mesh": "radial-gradient(at 40% 20%, rgba(124,58,237,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(249,115,22,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(124,58,237,0.08) 0px, transparent 50%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "count-up": "countUp 1.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "border-dance": "borderDance 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        borderDance: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
}
