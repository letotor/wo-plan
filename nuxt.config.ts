export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'netlify'
  }
})
