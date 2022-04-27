// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

import './assets/css/style.css'
import './assets/css/styles.css'
import './assets/css/bleu_vert.css'

import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import { apiUrl } from './config.js'
import './plugins.js'

Vue.config.productionTip = false

window.addEventListener('beforeunload', function () {
  navigator.sendBeacon(apiUrl + 'log/exit')
}, false)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  components: { App },
  render: h => h(App),
}).$mount('#root')
