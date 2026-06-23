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
        ink: '#16212f',
        slate: { 950: '#0d1d2e', 900: '#16212f', 800: '#1b2530' },
        // Navy action color — matches the live site's "Get a Quote" button (#2b598a).
        brand: {
          50: '#eaf1f8',
          100: '#d9e6f3',
          200: '#bcd4ea',
          300: '#8fb6d9',
          400: '#5b86b0',
          500: '#3a6ea0',
          600: '#2b598a',
          700: '#21466e',
          800: '#1d3c5d',
          900: '#1a3350',
        },
        // Forest green from the GRIT logo — secondary accent (logo wordmark, ticks).
        grit: { 500: '#3d8a64', 600: '#2f7250' },
        // Orange — the Court Designer section labels on the live site.
        accent: { DEFAULT: '#e0552e', 600: '#cc4a25' },
        sky: { accent: '#7fb2dd' }, // light blue used on dark sections
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
