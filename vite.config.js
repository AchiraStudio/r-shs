import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), netlify()],
  base: "/r-shs/",
  server: {
    host: true,
    port: 5500,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        '404': resolve(__dirname, 'index.html')  // generate 404.html
      }
    }
  },
})