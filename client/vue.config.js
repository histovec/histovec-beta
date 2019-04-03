const apiHost = process.env.API_HOST || 'localhost'
const apiPort = process.env.API_PORT || 8000

const VUE_APP_URL_API = 'http://' + apiHost + (apiPort ? ':' + apiPort : '')

module.exports = {
  publicPath: '/histovec',
  outputDir: 'dist',

  devServer: {
    proxy: {
      '/histovec/api': {
        pathRewrite: {
          '/histovec': ''
        },
        target: VUE_APP_URL_API || 'http://localhost:8000'
      }
    }
  }
}
