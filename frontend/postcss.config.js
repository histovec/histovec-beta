import path from 'path'
import { globbySync } from 'globby'

const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    // require('postcss-import')(),
    require('postcss-nested'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 1,
      features: {
        'custom-properties': false,
        'focus-visible-pseudo-class': false,
      },
    }),
    purgecss({
      paths: globbySync([
        path.join(__dirname, './public/index.html'),
        path.join(__dirname, './src/**/*.vue'),
        path.join(__dirname, './src/**/*.js')
      ]),
      whitelistPatterns: [
        /fa-(motorcycle|truck|car|certificate|cog)/,
        /fa-(minus-circle|warning|life-ring|spinner|spin|question-circle|arrow-left)/,
        /alert-(info|danger|warning|success)/
      ]
    }),
    require('postcss-csso'),
  ],
}