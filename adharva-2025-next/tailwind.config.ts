import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        gray: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2e2e2e',
          600: '#3d3d3d',
          500: '#6e6e6e',
          400: '#a0a0a0',
          300: '#d0d0d0',
        },
        blue: {
          500: '#3b82f6', // accent
        },
      },
      fontFamily: {
        mono: ["'Space Mono'", 'monospace'],
        sans: ["'Inter'", 'sans-serif'],
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '10%': { opacity: '0.8' },
          '20%': { opacity: '0.6' },
          '30%': { opacity: '0.9' },
          '40%': { opacity: '0.7' },
          '50%': { opacity: '1' },
          '60%': { opacity: '0.8' },
          '70%': { opacity: '0.9' },
          '80%': { opacity: '0.6' },
          '90%': { opacity: '1' },
        },
      },
      animation: {
        glitch: 'glitch 1s infinite linear',
        flicker: 'flicker 2s infinite linear',
      },
    },
  },
  plugins: [],
};

export default config; 