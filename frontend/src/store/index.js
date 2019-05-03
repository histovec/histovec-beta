import Vue from 'vue'
import Vuex from 'vuex'
import histovec from './modules/histovec.js'
import identity from './modules/identity.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    api: {
      fetching: {},
      http: {},
      json: {},
      hit: {},
      decrypted: {},
      hits: {},
      noHits: {},
      error: {}
    }
  },
  mutations: {
    updateApiStatus (state, update) {
      Object.keys(update).forEach( status => {
        let apiName = Object.keys(update[status])[0]
        Vue.set(this.state.api[status], apiName, update[status][apiName])
      })
    },
    initApiStatus (state, apiName) {
      ['http', 'json', 'hit', 'error'].forEach(key => Vue.set(this.state.api[key], apiName, undefined))
      Vue.set(this.state.api.fetching, apiName, true)
    }
  },
  modules: {
    identity,
    histovec
  }
})
