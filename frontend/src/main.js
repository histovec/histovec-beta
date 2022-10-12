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
import { isTrue, getInteger } from './utils/envFormat';

dayjs.extend(customParseFormat)


window.addEventListener('beforeunload', function () {
  navigator.sendBeacon(apiUrl + 'log/exit')
}, false)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

const app = createApp(App)

// Ajout des variables globales
app.config.globalProperties.$outdatedData = isTrue(import.meta.env.VITE_OUTDATED_DATA);
app.config.globalProperties.$showDataDate = isTrue(import.meta.env.VITE_SHOW_DATA_DATE);
app.config.globalProperties.$codePartage = isTrue(import.meta.env.VITE_CODE_PARTAGE);
app.config.globalProperties.$usePreviousMonthForData = isTrue(import.meta.env.VITE_USE_PREVIOUS_MONTH_FOR_DATA);
app.config.globalProperties.$previousMonthShift = getInteger(import.meta.env.VITE_PREVIOUS_MONTH_SHIFT);
app.config.globalProperties.$ignoreUtacCache = isTrue(import.meta.env.VITE_IGNORE_UTAC_CACHE);

app.use(VueDsfr, { icons: Object.values(icons) } )
  // On paramètre vue3-clipboard pour sélectionner
  // automatiquement le contexte de l'élément du DOM dans lequel sera effectuée la copie
app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
app.use(router)
app.mount('#app')
