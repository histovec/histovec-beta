import { createApp } from 'vue'
import Maska from 'maska'

import '@gouvminint/vue-dsfr/styles'
import VueDsfr from '@gouvminint/vue-dsfr'
import * as icons from './icons.js'

import App from './App.vue'
import router from './router/index.js'

import { apiUrl } from './config.js'


window.addEventListener('beforeunload', function () {
  navigator.sendBeacon(apiUrl + 'log/exit')
}, false)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

createApp(App)
  .use(VueDsfr, { icons: Object.values(icons) } )
  .use(router)
  .use(Maska)
  .mount('#app')
