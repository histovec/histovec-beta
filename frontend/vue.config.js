
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')

module.exports = {
  publicPath: `${process.env.VUE_APP_TITLE}`,
  outputDir: 'dist',
  runtimeCompiler: true,
  productionSourceMap: process.env.VUE_APP_SOURCE_MAP === 'true',
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
  configureWebpack: {
    // Merged into the final Webpack config
    plugins: [
      new PurgecssPlugin({
        paths: glob.sync([
          path.join(__dirname, './public/index.html'),
          path.join(__dirname, './src/**/*.vue'),
          path.join(__dirname, './src/**/*.js')
        ]),
        whitelistPatterns: [
          /fa\-(motorcycle|truck|car|certificate|cog)/,
          /fa\-(minus\-circle|warning|life\-ring|spinner|spin|question\-circle|arrow\-left)/,
          /alert\-(info|danger|warning|success)/
        ]
      })
    ]
  },
  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
  },
}
