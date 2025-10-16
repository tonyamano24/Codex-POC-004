import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Flappy Bird Nuxt',
      meta: [
        {
          name: 'description',
          content: 'Flappy Bird clone built with Nuxt 3 and Tailwind CSS'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      gameTitle: 'Flappy Bird Reimagined'
    }
  }
})
