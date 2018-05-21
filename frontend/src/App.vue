<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'

import apiConf from './assets/json/backend.json'
import localization from './assets/json/lang.json'
import operations from './assets/json/libelle_operations.json'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import lodash from 'lodash'

Vue.prototype.$lodash = lodash

window.bus = new Vue()

Vue.mixin({
  data () {
    return {
      apiUrl: apiConf.api.url.replace('<APP>', 'histovec'),
      localization: localization,
      operations: operations,
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
