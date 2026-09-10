/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep obsidian base with tactile titanium warmth
        canvas: {
          base: '#0B0D11',
          subtle: '#10131A',
          surface: '#151922',
          elevated: '#1C222E',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-strong': 'rgba(255, 255, 255, 0.14)',
          'border-focus': 'rgba(242, 94, 34, 0.4)',
        },
        // LEVELX Signature Electric Ochre / Cadmium Tangerine - purposeful energy, NOT neon AI
        brand: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F25E22', // LEVELX Core Radiant Amber/Orange
          600: '#EA4C10',
          700: '#C2370B',
          800: '#9A2C0D',
          900: '#7C260E',
          accent: '#FF6B00',
        },
        // Secondary Innovation Tones
        teal: {
          surface: '#0F2424',
          border: 'rgba(45, 212, 191, 0.2)',
          text: '#2DD4BF',
        },
        indigo: {
          surface: '#131B2E',
          border: 'rgba(129, 140, 248, 0.2)',
          text: '#818CF8',
        },
        emerald: {
          surface: '#0E2419',
          border: 'rgba(52, 211, 153, 0.25)',
          text: '#34D399',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
          inverse: '#0B0D11',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'surface-subtle': '0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
        'surface-elevated': '0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'surface-card': '0 12px 36px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'tactile-btn': '0 2px 0 rgba(0, 0, 0, 0.4), 0 4px 12px rgba(242, 94, 34, 0.2)',
        'tactile-surface': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-subtle': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)',
        'gradient-card': 'linear-gradient(145deg, #151922 0%, #11141C 100%)',
        'brand-gradient': 'linear-gradient(135deg, #F25E22 0%, #EA4C10 100%)',
        'brand-glow': 'radial-gradient(ellipse at 50% -20%, rgba(242, 94, 34, 0.15), transparent 70%)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        badgeShimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-subtle': 'floatSubtle 6s ease-in-out infinite',
        'shimmer': 'badgeShimmer 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
