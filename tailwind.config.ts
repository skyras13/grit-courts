import type { Config } from 'tailwindcss';

/**
 * Design tokens for GRIT Courts — implements the "GRIT Courts Site" design:
 * a warm cream + paper base, deep ink headings, a navy (#2b598a) brand accent,
 * and a dark slate section color. Type pairing: Archivo (display), Manrope (UI),
 * Newsreader (editorial italic). See app/globals.css for the CSS-variable layer.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f4f2ee',
        paper: '#ffffff',
        ink: '#15211b',
        slate: { 950: '#0e1813', 900: '#15211b', 800: '#1b2922' },
        // Forest-green brand scale, sampled from the real GRIT Courts logo
        // (logo = charcoal mountains + green court). 600 is the primary accent.
        brand: {
          50: '#edf6f0',
          100: '#d6ecdf',
          200: '#aed8c1',
          300: '#79bd98',
          400: '#46a06f',
          500: '#2f865a',
          600: '#27704a',
          700: '#1f5a3b',
          800: '#1b4a31',
          900: '#173d29',
        },
        sky: { accent: '#7fc6a3' }, // light green used on dark sections
        muted: {
          DEFAULT: '#5a6570',
          soft: '#7c8893',
          faint: '#8b97a3',
          line: '#e7e2d9',
          input: '#dfe3e8',
        },
        gold: '#e0a32e',
        // ── Compatibility aliases for the programmatic city/service-area pages ──
        border: '#e7e2d9',
        fg: { DEFAULT: '#16212f', muted: '#5a6570' },
        'bg-muted': '#f4f2ee',
        court: {
          50: '#ecfbff', 100: '#cef4ff', 200: '#a3ecff', 300: '#62dfff', 400: '#1fc8f5',
          500: '#04a7d8', 600: '#0585b5', 700: '#0b6a92', 800: '#125777', 900: '#144965',
        },
        kelly: { 400: '#3ed27a', 500: '#1eb863', 600: '#129a52' },
      },
      fontFamily: {
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
      },
      maxWidth: { content: '1240px' },
      borderRadius: { DEFAULT: '6px', md: '7px', lg: '9px', xl: '12px' },
      boxShadow: {
        card: '0 1px 2px rgba(20,40,60,0.05), 0 10px 30px -18px rgba(20,40,60,0.25)',
        lift: '0 30px 60px -32px rgba(20,40,60,0.42)',
        modal: '0 40px 90px -30px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin360: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        spin360: 'spin360 0.8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
