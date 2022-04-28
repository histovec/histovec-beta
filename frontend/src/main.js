// import { createApp } from 'vue'


// import '@gouvminint/vue-dsfr/styles'
// import VueDsfr from '@gouvminint/vue-dsfr'

import * as icons from './icons.js'

// import App from './App.vue'

// import router from './router/index.js'

// // import store from './store/index.js'
// import { apiUrl } from './config.js'
// // import './plugins.js'


// window.addEventListener('beforeunload', function () {
//   navigator.sendBeacon(apiUrl + 'log/exit')
// }, false)

// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title
//   next()
// })

// createApp(App)
//   // .use(store)
//   .use(VueDsfr) // , { icons: Object.values(icons) } )
//   .use(router)
//   .mount('#app')

import { createApp } from 'vue'


import '@gouvminint/vue-dsfr/styles'
import VueDsfr from '@gouvminint/vue-dsfr'

import App from './App.vue'
import router from './router/index.js'

createApp(App)
  .use(VueDsfr, { icons: Object.values(icons) } )
  .use(router)
  .mount('#app')
