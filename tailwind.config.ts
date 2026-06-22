import type { Config } from 'tailwindcss';

/**
 * Design tokens for GRIT Courts.
 * Brand seed color is #2b598a (the navy from the original Square site's theme-color).
 * We evolve it into a full, accessible scale and pair it with "court" accents
 * (the vibrant blue + green acrylic surfacing) and a warm neutral foundation.
 *
 * Tokens map to CSS variables declared in app/globals.css so themes can be
 * adjusted in one place. See docs/05-design/design-system.md.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand navy scale (seed: brand-700 ≈ #2b598a)
        brand: {
          50: '#eef4fb',
          100: '#d6e4f4',
          200: '#aecae8',
          300: '#7ea9d8',
          400: '#5285c4',
          500: '#3669a8',
          600: '#2b598a', // brand seed
          700: '#244a73',
          800: '#1f3d5e',
          900: '#1b3350',
          950: '#11203455',
        },
        // Court acrylic accent (vibrant playing-surface blue)
        court: {
          50: '#ecfbff',
          100: '#cef4ff',
          200: '#a3ecff',
          300: '#62dfff',
          400: '#1fc8f5',
          500: '#04a7d8',
          600: '#0585b5',
          700: '#0b6a92',
          800: '#125777',
          900: '#144965',
        },
        // Out-of-bounds / kitchen green
        kelly: {
          400: '#3ed27a',
          500: '#1eb863',
          600: '#129a52',
        },
        ink: '#101720',
        paper: '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.625rem',
        lg: '0.875rem',
        xl: '1.125rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,23,32,0.06), 0 8px 24px -12px rgba(16,23,32,0.18)',
        lift: '0 12px 40px -12px rgba(43,89,138,0.35)',
      },
      maxWidth: {
        content: '76rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
