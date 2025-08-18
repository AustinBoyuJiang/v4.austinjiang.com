import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 开发环境下的SPA路由支持
    historyApiFallback: true
  },
  build: {
    // 生产环境构建配置
    rollupOptions: {
      // 确保所有路由都回退到index.html
      input: {
        main: './index.html'
      }
    }
  }
})
