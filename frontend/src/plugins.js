import Vue from 'vue'
import VueShortkey from 'vue-shortkey'
import VueScrollTo from 'vue-scrollto'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

Vue.use(VueShortkey)
Vue.use(VueScrollTo, {
  offset: -5,
  duration: 1000,
})
