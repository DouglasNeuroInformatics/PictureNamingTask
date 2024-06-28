import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'pnt-test',
  build: {
    target: 'esnext' //browsers can handle the latest ES features
  },
  plugins: [react()],
})
