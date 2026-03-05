export default defineNuxtConfig({
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
