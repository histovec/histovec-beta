import Vue from 'vue'
import Vuex from 'vuex'
import histovec from './modules/histovec.js'
import identity from './modules/identity.js'
import techControl from './modules/techControl.js'
import VuexPersistence from 'vuex-persist'
import objectPath from 'object-path'

import api from '@/api'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    logCounter: 0,
    api: {
      fetching: {},
      http: {},
      json: {},
      hit: {},
      decrypted: {},
      hits: {},
      noHits: {},
      error: {}
    },
    config: {
      beta: false,
      fniMode: true,
      allTabs: false,
      id: {
        dateNaissance: true
      },
      otc: false,
      otcGraph: false,
      pdf: true,
      updateDate: true,
      v1: false
    },
    configEnabler: {
      allTabs: ['ctrl', 'alt', 'a'],
      beta: ['ctrl', 'alt', 'b'],
      fniMode: ['ctrl','alt','f'],
      'id.dateNaissance': ['ctrl', 'alt', 'd'],
      pdf: ['ctrl', 'alt', 'p'],
      updateDate: ['ctrl', 'alt', 'u'],
      v1: ['ctrl','alt','v'],
      otc: ['ctrl', 'alt', 'o'],
      otcGraph: ['ctrl', 'alt', 'g'],
    },
    feedback: {},
    contact: {}
  },
  mutations: {
    toggleConfig (state, key) {
      let leafPath = key.replace(/^.*\./, '')
      let rootPath = key.replace(/((.*)\..*|.*)/, '$2')
      rootPath = rootPath === '' ? 'config' : `config.${rootPath}`
      let model = objectPath.get(state, rootPath)
      Vue.set(model, leafPath, !model[leafPath])
    },
    updateApiStatus (state, update) {
      Object.keys(update).forEach( status => {
        let apiName = Object.keys(update[status])[0]
        Vue.set(state.api[status], apiName, update[status][apiName])
      })
    },
    initApiStatus (state, apiName) {
      ['http', 'json', 'hit', 'error'].forEach(key => Vue.set(state.api[key], apiName, undefined))
      Vue.set(state.api.fetching, apiName, true)
    },
    updateLogCounter (state) {
      state.logCounter++
    },
    updateFeedback (state, feedback) {
      state.feedback = feedback
    },
    updateContact (state, contact) {
      state.contact = contact
    }
  },
  actions: {
    async log ({ commit }, path) {
      await api.log(path, localStorage.getItem('userId'))
      commit('updateLogCounter')
    },
    async sendFeedback ({ commit }, feedback) {
      await api.sendFeedback(feedback)
      commit('updateFeedback')
    },
    async sendContact ({ commit }, contact) {
      await api.sendContact(contact)
      commit('updateContact')
    },
    initApiStatus ({ commit }, apiName) {
      commit('initApiStatus', apiName)
    }
  },
  modules: {
    identity,
    histovec,
    techControl
  },
  plugins: [vuexLocal.plugin]
})
