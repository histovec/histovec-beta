import { createApp } from 'vue'

import '@gouvminint/vue-dsfr/styles'
import VueDsfr from '@gouvminint/vue-dsfr'
import * as icons from '@/icons.js'

import VueClipboard from 'vue3-clipboard'

import App from '@/App.vue'
import router from '@/router/index.js'
import { apiUrl } from '@/config.js'
import { createPinia } from 'pinia'
import axios from 'axios';
import api from '@Api/index.js'

let compteurAuthentification = 0
let derniereRequete = ''

window.addEventListener('beforeunload', function () {
  navigator.sendBeacon( `${apiUrl}/logs/${localStorage.getItem('userId')}/exit`)
}, false)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

axios.defaults.baseURL = apiUrl

axios.interceptors.request.use(async function (config)  {
  if (!config.headers.Authorization && config.url !== '/get_token') {
    await api.authentication()
  }
  if (config.url !== '/get_token' && config.url !== derniereRequete) {
    compteurAuthentification = 0
    derniereRequete = config.url
  }
  config.headers.Authorization = axios.defaults.headers.common.Authorization
  return config;
});

axios.interceptors.response.use(
  async function (response) {
    if (response.config.url !== '/get_token') {
      compteurAuthentification = 0
    }
    return response
  },
  async function (error) {
    if ((error.response.status === 403 || error.response.status === 401) && compteurAuthentification < 3) {
      compteurAuthentification++
      await api.authentication()
      error.config.headers.Authorization = axios.defaults.headers.common.Authorization

      const response = await axios.request(error.config)
        .catch(error => {
          return Promise.reject(error)
        })

      return Promise.resolve(response)
    } else {
      return Promise.reject(error)
    }
});

createApp(App)
  .use(VueDsfr, { icons: Object.values(icons) } )
  // On paramètre vue3-clipboard pour sélectionner
  // automatiquement le contexte de l'élément du DOM dans lequel sera effectuée la copie
  .use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
  .use(router)
  .use(createPinia())
  .mount('#app')
