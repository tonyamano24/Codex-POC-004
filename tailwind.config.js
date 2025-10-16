/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          950: '#051726'
        }
      },
      animation: {
        'cloud-drift': 'cloud-drift 60s linear infinite',
        float: 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'cloud-drift': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-200%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(4px)' }
        }
      }
    }
  },
  plugins: []
}
