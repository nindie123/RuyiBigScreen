import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 可以在这里添加全局 SCSS 变量注入
        additionalData: '',
      },
    },
  },
})
