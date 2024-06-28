import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pnt-test/',
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  },
},)
