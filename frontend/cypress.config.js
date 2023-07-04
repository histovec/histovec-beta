const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000/histovec/',
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
  env: {
    url_accueil: 'accueil',
    url_proprietaire: 'proprietaire',
    url_acheteur: 'acheteur',
    url_rapport_vendeur: 'rapport-vendeur',
    url_contact: 'contact',
    url_faq: 'faq',
    url_donnees_personnelles: 'donnees-personnelles-et-cookies',
    url_mentions_legales: 'mentions-legales',
    url_plan_site: 'plan-du-site',
    url_accessibilite: 'accessibilite',
  }
})
