import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        'card-hover': 'var(--bg-card-hover)',
        border: 'var(--border-subtle)',
        'border-card': 'var(--border-card)',
        primary: {
          DEFAULT: '#00F5FF',
          hover: '#33f7ff',
          glow: 'rgba(0, 245, 255, 0.35)',
        },
        amazon: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          acai: '#818CF8',
          dark: '#070A12',
          surface: '#0E1424',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -4px rgba(0, 245, 255, 0.35)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
      }
    },
  },
  plugins: [],
};

export default config;
