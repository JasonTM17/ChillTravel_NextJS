import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ─── Design DNA Palette ─────────────────────────────────────────── */
        'booking-blue': '#0277D4',
        'deep-blue': '#005EA8',
        'orange-cta': '#FF6D1A',
        'sky-surface': '#EAF7FF',
        'teal-trust': '#0F8B7B',
        ink: '#071827',
        'muted-ink': '#476273',
        border: '#D9ECFB',

        /* ─── Legacy Traveloka tokens (kept for backward compat) ─────────── */
        'tv-blue': '#0064D2',
        'tv-blue-dark': '#004EA2',
        'tv-blue-light': '#E8F1FB',
        'tv-blue-mid': '#1A7FE8',
        'tv-orange': '#FF6D00',
        'tv-orange-dark': '#E55A00',
        'tv-orange-light': '#FFF3E8',
        'tv-bg': '#F5F5F5',
        'tv-surface': '#FFFFFF',
        'tv-border': '#E8E8E8',
        'tv-border-dark': '#D0D0D0',
        'tv-ink': '#1A1A1A',
        'tv-ink-2': '#4A4A4A',
        'tv-ink-3': '#767676',
        'tv-ink-4': '#A0A0A0',
        'tv-green': '#00A86B',
        'tv-red': '#E53935',
        'tv-yellow': '#FFB300',
      },
      borderRadius: {
        tv: '8px',
        'tv-sm': '6px',
        'tv-lg': '12px',
        'tv-xl': '16px',
      },
      boxShadow: {
        /* ─── Design DNA card shadows (blue-tinted) ──────────────────────── */
        'card-sm': '0 2px 8px rgba(217, 236, 251, 0.6)',
        card: '0 3px 10px rgba(217, 236, 251, 0.7)',
        'card-lg': '0 4px 12px rgba(217, 236, 251, 0.8)',

        /* ─── Legacy Traveloka shadows ───────────────────────────────────── */
        'tv-card': '0 1px 4px rgba(0,0,0,0.08)',
        'tv-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'tv-modal': '0 8px 32px rgba(0,0,0,0.16)',
        'tv-header': '0 2px 8px rgba(0,0,0,0.08)',
      },
      fontSize: {
        'tv-xs': ['11px', { lineHeight: '16px' }],
        'tv-sm': ['12px', { lineHeight: '18px' }],
        'tv-base': ['14px', { lineHeight: '20px' }],
        'tv-md': ['16px', { lineHeight: '24px' }],
        'tv-lg': ['18px', { lineHeight: '26px' }],
        'tv-xl': ['20px', { lineHeight: '28px' }],
        'tv-2xl': ['24px', { lineHeight: '32px' }],
      },
      fontFamily: {
        sans: [
          'var(--font-be-vietnam-pro)',
          'Be Vietnam Pro',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
