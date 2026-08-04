import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Mismo origen que en producción (un solo dominio en Vercel): el navegador
    // solo ve localhost:5173, y Vite reenvía /api al backend por detrás. Así
    // la cookie de sesión funciona igual en dev que en producción, sin CORS.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
