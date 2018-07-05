// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueShortkey from 'vue-shortkey'

Vue.use(VueResource)
Vue.use(VueShortkey)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  router,
  template: '<App/>',
  components: { App }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
