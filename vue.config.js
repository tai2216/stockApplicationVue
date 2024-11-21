const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",    // Modern replacement
    // allowedHosts: ['.ngrok-free.app'],
    https: true, // Serve the development server over HTTPS
    host: '0.0.0.0', // Allow connections from outside localhost
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Spring Boot 的後端地址
        changeOrigin: true,
        pathRewrite: { '^/api': '' },   // 移除 `/api`
        onProxyReq: (proxyReq, req, res) => {
          // 確保沒有無效的標頭名稱
          proxyReq.setHeader('Accept', 'application/json');
          // proxyReq.setHeader('Content-Type', 'application/json');
        },
        onProxyRes: (proxyRes, req, res) => {
          // 設置適當的 COOP 標頭
          proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
          proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
        }
      },
    },
  }
})
