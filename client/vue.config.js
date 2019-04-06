module.exports = {
  publicPath: '/histovec',
  assetsDir: 'static',
  indexPath: './histovec/index.html',
  outputDir: 'dist',

  devServer: {
        host: '0.0.0.0',
        disableHostCheck: true
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
  },
}
