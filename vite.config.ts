import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
// 生产构建部署到 GitHub Pages 项目站点 /Eye-healthcare/，开发时仍用根路径
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Eye-healthcare/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '亮眸训练营 · 斜视家庭视功能训练',
        short_name: '亮眸训练营',
        description: '间歇性外斜视儿童家庭视功能训练（集合 / 融像 / 调节）辅助应用',
        theme_color: '#0ea5e9',
        background_color: '#f0f9ff',
        display: 'standalone',
        orientation: 'any',
        lang: 'zh-CN',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
}))
