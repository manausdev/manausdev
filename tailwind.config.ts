import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        'on-background': '#191c1e',
        surface: {
          DEFAULT: '#f7f9fb',
          dim: '#d8dadc',
          bright: '#f7f9fb',
          'container-lowest': '#ffffff',
          'container-low': '#f2f4f6',
          container: '#eceef0',
          'container-high': '#e6e8ea',
          'container-highest': '#e0e3e5',
          variant: '#e0e3e5',
          tint: '#2b6954',
        },
        'on-surface': {
          DEFAULT: '#191c1e',
          variant: '#404944',
        },
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        outline: {
          DEFAULT: '#707974',
          variant: '#bfc9c3',
        },
        primary: {
          DEFAULT: '#003527',
          container: '#064e3b',
          'on-container': '#80bea6',
          fixed: '#b0f0d6',
          'fixed-dim': '#95d3ba',
          'on-fixed': '#002117',
          'on-fixed-variant': '#0b513d',
          inverse: '#95d3ba',
        },
        'on-primary': '#ffffff',
        secondary: {
          DEFAULT: '#006c49',
          container: '#6cf8bb',
          'on-container': '#00714d',
          fixed: '#6ffbbe',
          'fixed-dim': '#4edea3',
          'on-fixed': '#002113',
          'on-fixed-variant': '#005236',
        },
        'on-secondary': '#ffffff',
        tertiary: {
          DEFAULT: '#00314a',
          container: '#00496a',
          'on-container': '#45bbff',
          fixed: '#c9e6ff',
          'fixed-dim': '#89ceff',
          'on-fixed': '#001e2f',
          'on-fixed-variant': '#004c6e',
        },
        'on-tertiary': '#ffffff',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        'on-error': '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'card-ambient': '0 4px 20px rgba(6, 78, 59, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(6, 78, 59, 0.1), 0 8px 10px -6px rgba(6, 78, 59, 0.04)',
        'elevated': '0 20px 30px -10px rgba(0, 53, 39, 0.08)',
        'glow-leaf': '0 0 0 3px rgba(0, 108, 73, 0.15)',
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        'container-max': '1280px',
        'gutter': '24px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '48px',
      }
    },
  },
  plugins: [],
};

export default config;
