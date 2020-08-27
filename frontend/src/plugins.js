import Vue from 'vue'
import VueShortkey from 'vue-shortkey'
import VueScrollTo from 'vue-scrollto'

import dayjs from 'dayjs'
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

Vue.use(VueShortkey)
Vue.use(VueScrollTo, {
  offset: -5,
  duration: 1000,
})
