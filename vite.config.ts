import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  },
},)
