/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#6c5ce7',
          600: '#5b4bc4',
          700: '#4a3da1',
          800: '#3a2e7e',
          900: '#2a1f5b',
        },
        secondary: {
          500: '#a29bfe',
        },
        success: {
          500: '#00b894',
          600: '#00a086',
        },
        danger: {
          500: '#d63031',
          600: '#c0282a',
        },
        warning: {
          500: '#fdcb6e',
          600: '#f4b740',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        gaming: ['Cinzel', 'serif'],
      },
      animation: {
        'damage-number': 'damageNumber 1s ease-out forwards',
        'combo-banner': 'comboBanner 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'water-shimmer': 'waterShimmer 3s ease-in-out infinite',
        'fire-pulse': 'firePulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        damageNumber: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-50px) scale(1.2)', opacity: '0' },
        },
        comboBanner: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        waterShimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        firePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
