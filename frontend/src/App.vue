<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCodeMirror from 'vue-codemirror'
import VueClipboard from 'vue-clipboard2'

import apiConf from './assets/json/backend.json'
import localization from './assets/json/lang.json'

import lodash from 'lodash'

Vue.prototype.$lodash = lodash

Vue.use(VueCodeMirror)
Vue.use(VueClipboard)

window.bus = new Vue()

Vue.mixin({
  data () {
    return {
      apiUrl: apiConf.api.url.replace('<APP>', process.env.APP),
      localization: localization,
      lang: localization.default
    }
  },
  mounted () {
    window.bus.$on('langChange', value => {
      this.lang = value
    })
  }
})

export default {
  name: 'app'
}
</script>

<style lang="scss" src="./assets/scss/style.scss"></style>
