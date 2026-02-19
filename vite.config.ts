import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno usando la util de Vite
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy para evitar problemas de CORS con la API de Football-Data
        '/api': {
          target: 'https://api.football-data.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            // (debug) la carga de env se realiza con loadEnv

            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Añadir la API Key al proxy request
              const apiKey = env.VITE_FOOTBALL_API_KEY;
              if (apiKey) {
                proxyReq.setHeader('X-Auth-Token', apiKey);
              }
              console.log('[Proxy]', req.method, req.url);
            });
          },
        },
      },
    },
  }
})
