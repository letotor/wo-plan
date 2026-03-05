export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true
  },
  ssr: false,
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'netlify'
  },
  build: {
    transpile: ['ag-grid-community', 'ag-grid-vue3']
  },
  vite: {
    ssr: {
      external: ['ag-grid-community', 'ag-grid-vue3']
    }
  }
})
