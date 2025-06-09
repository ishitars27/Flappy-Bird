import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host:true,
    proxy: {
      '/api': {
        target: 'https://flappybird-pydw.vercel.app', 
        changeOrigin: true,

      },
    },
  },
  plugins: [react()],
})
