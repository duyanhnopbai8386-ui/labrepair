import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'admin-entry-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            req.url = '/admin.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    strictPort: true
  },
  build: {
    rollupOptions: {
      input: 'admin.html'
    }
  }
})
