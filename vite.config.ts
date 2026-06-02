import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'vendor';
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          if (id.includes('node_modules/pdf-lib')) {
            return 'pdf-lib';
          }
          if (id.includes('node_modules/xlsx')) {
            return 'xlsx';
          }
          if (id.includes('node_modules/tesseract')) {
            return 'tesseract';
          }
          if (id.includes('node_modules/@ffmpeg')) {
            return 'ffmpeg';
          }
          if (id.includes('node_modules/epubjs')) {
            return 'epub';
          }
          if (id.includes('node_modules/html2pdf')) {
            return 'html2pdf';
          }
          if (id.includes('node_modules/heic2any')) {
            return 'heic';
          }
        }
      }
    }
  }
})
