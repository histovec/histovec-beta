const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvent(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
