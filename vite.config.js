import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Year of the build, so the footer copyright advances only when the site is redeployed
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
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
