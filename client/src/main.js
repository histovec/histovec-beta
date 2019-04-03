// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueShortkey from 'vue-shortkey'
import VueCookie from 'vue-cookie'
import apiConf from './assets/json/backend.json'

Vue.use(VueResource)
Vue.use(VueShortkey)
Vue.use(VueCookie)

Vue.config.productionTip = false

const appName = process.env.VUE_APP_NAME || 'histovec'

window.addEventListener('beforeunload', function () {
  var apiUrl = apiConf.api.url.replace(appName, process.env.APP).replace(/"/g, '')
  navigator.sendBeacon(apiUrl + 'log/exit')
}, false)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#root')

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
