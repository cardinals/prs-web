const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  baseUrl: '/',
  outputDir: './docker/dist',
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // 构建过程中启用gzip压缩
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8888,
    https: false,
    hotOnly: false,
    // 配置代理转发
    proxy: {
      '/SearchCase': {
        target: 'http://192.168.22.63:8081',
        changeOrigin: true
      }
    },
    before: app => {}
  }
}
