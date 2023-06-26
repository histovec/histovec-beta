import { createApp } from 'vue'

import '@gouvminint/vue-dsfr/styles'
import VueDsfr from '@gouvminint/vue-dsfr'
import * as icons from './icons.js'

import VueClipboard from 'vue3-clipboard'

import App from './App.vue'
import router from './router/index.js'

import { apiUrl } from './config.js'


import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)


window.addEventListener('beforeunload', function () {
  navigator.sendBeacon(apiUrl + '/log/exit')
}, false)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

createApp(App)
  .use(VueDsfr, { icons: Object.values(icons) } )
  // On paramètre vue3-clipboard pour sélectionner
  // automatiquement le contexte de l'élément du DOM dans lequel sera effectuée la copie
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  .use(router)
  .mount('#app')
