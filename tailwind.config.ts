import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0f',
          900: '#0f0f17',
          800: '#15151f',
          700: '#1c1c2a',
          600: '#252536',
          500: '#2e2e42',
        },
        accent: {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          glow: '#a78bfa',
          gold: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
};

export default config;