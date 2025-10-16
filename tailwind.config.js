/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app.{js,ts,jsx,tsx,vue}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        }
      },
      boxShadow: {
        pipe: '0 0 0 3px rgba(6, 182, 212, 0.35)'
      }
    }
  },
  plugins: []
}
