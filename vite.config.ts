import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  base: './',
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[hash].js'
      }
    },
    commonjsOptions: { transformMixedEsModules: true } // Change
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
