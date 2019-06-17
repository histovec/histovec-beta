
module.exports = {
  publicPath: `${process.env.VUE_APP_TITLE}`,
  outputDir: 'dist',
  runtimeCompiler: true,
  devServer: {
    public: 'http://0.0.0.0/',
    overlay: true,
    host: '0.0.0.0',
    port: process.env.VUE_APP_PORT,
    hot: true,
    disableHostCheck: true,
    watchOptions: {
      poll: true
    }
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
  },
}
