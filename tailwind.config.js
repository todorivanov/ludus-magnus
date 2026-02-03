/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Roman Empire Theme
        roman: {
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#d4a418', // Primary gold
            600: '#b8860b', // Dark gold
            700: '#92400e',
            800: '#78350f',
            900: '#451a03',
          },
          crimson: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#dc2626', // Roman red
            600: '#b91c1c',
            700: '#991b1b',
            800: '#7f1d1d',
            900: '#450a0a',
          },
          marble: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
          },
          bronze: {
            50: '#fdf8f6',
            100: '#f2e8e5',
            200: '#eaddd7',
            300: '#d6c5b8',
            400: '#cd7f32', // Classic bronze
            500: '#b87333',
            600: '#a0522d',
            700: '#8b4513',
            800: '#6b3a0f',
            900: '#4a2c0a',
          },
          parchment: {
            50: '#fefdfb',
            100: '#fdf6e3',
            200: '#f5e6c8',
            300: '#e8d4a8',
            400: '#d4c098',
            500: '#c4a86c',
            600: '#a68b4d',
            700: '#8b7355',
            800: '#6b5a42',
            900: '#4a3f2e',
          },
        },
        // Semantic colors for the game
        health: {
          high: '#22c55e',
          medium: '#eab308',
          low: '#ef4444',
          critical: '#7f1d1d',
        },
        stamina: {
          high: '#3b82f6',
          medium: '#6366f1',
          low: '#8b5cf6',
        },
        fame: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          legendary: '#9333ea',
        },
      },
      fontFamily: {
        roman: ['Cinzel', 'Times New Roman', 'serif'],
        body: ['Lato', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'marble-texture': "url('/textures/marble.png')",
        'parchment-texture': "url('/textures/parchment.png')",
        'arena-sand': "url('/textures/sand.png')",
      },
      boxShadow: {
        'roman': '0 4px 6px -1px rgba(139, 69, 19, 0.3), 0 2px 4px -1px rgba(139, 69, 19, 0.2)',
        'roman-lg': '0 10px 15px -3px rgba(139, 69, 19, 0.4), 0 4px 6px -2px rgba(139, 69, 19, 0.2)',
        'gold-glow': '0 0 15px rgba(212, 164, 24, 0.5)',
        'crimson-glow': '0 0 15px rgba(220, 38, 38, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
