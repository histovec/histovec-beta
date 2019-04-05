const apiHost = process.env.API_HOST || 'localhost'
const apiPort = process.env.API_PORT || 9200

const VUE_APP_URL_API = 'http://' + apiHost + (apiPort ? ':' + apiPort : '')

module.exports = {
  publicPath: '/histovec',
  outputDir: 'dist',

  devServer: {
    overlay: true,
    proxy: {
      '/histovec/api': {
        pathRewrite: {
          '^/.*/id/[a-f0-9-]{36}/([A-Za-z0-9_-]{43}=)$': '/siv/_search?q="$1"&size=1&terminate_after=1',
        },
        target: VUE_APP_URL_API || 'http://localhost:9200',
      },
    },
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
  },
}
