import Vue from 'vue'
import VueResource from 'vue-resource'
import VueShortkey from 'vue-shortkey'
import VueCookie from 'vue-cookie'
import VueScrollTo from 'vue-scrollto'

Vue.use(VueResource)
Vue.use(VueShortkey)
Vue.use(VueCookie)
Vue.use(VueScrollTo, {
  offset: -5,
  duration: 1000,
})
