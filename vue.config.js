const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const baseApi = process.env.BASE_URL
console.log(baseApi)

module.exports = {
  configureWebpack: (config) => {
    // 分析打包体积
    if (process.env.IS_ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    https: false,
    open: false,
    // 配置多个代理
    proxy: {
      '/api': {
        target: baseApi,
        ws: true,
        changeOrigin: true, // 允许websockets跨域
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
