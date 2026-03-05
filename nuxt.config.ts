export default defineNuxtConfig({
ssr: true,
 vite: {
  ssr: {
    noExternal: ['ag-grid-community', 'ag-grid-vue3']
  }
},
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'netlify'
  }
})
