import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/playground/',
  plugins: [
    react(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.VSCODE_TEXTMATE_DEBUG': 'false',
  },
})
