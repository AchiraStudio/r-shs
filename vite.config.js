import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), netlify()],
  base: "/r-shs/",
  server: {
    host: true,
    port: 8888,
    strictPort: true,
  },
})