import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
},
)


/*export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Ensure API responses don't get HTML mixed in
            if (proxyRes.headers['content-type'] && 
                proxyRes.headers['content-type'].includes('application/json')) {
              proxyRes.headers['x-powered-by'] = 'MyAppServer';
            }
          });
        }
      }
    }
  }
})*/