import Vue from 'vue'
import Vuex from 'vuex'
import identity from './modules/identity.js'
import histovec from './modules/histovec.js'
import VuexPersistence from 'vuex-persist'
import objectPath from 'object-path'
import { v4 as uuidv4 } from 'uuid'


import api from '@/api'

import contact from '@/assets/json/contact.json'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

Vue.use(Vuex)


if (localStorage.getItem('userId') === null) {
  const uuid = uuidv4()
  localStorage.setItem('userId', uuid, 1)
}

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
      csaAnnulationCi: false,
      dataDate: false,
      ignoreUtacCache: false,
      newData: false,
    },
    configEnabler: {
      csaAnnulationCi: ['ctrl', 'alt', 'm'],
      dataDate: ['ctrl', 'alt', 'd'],
      ignoreUtacCache: ['ctrl', 'alt', 'a'],
      newData: ['ctrl', 'alt', 'b'],
    },
    isContactModalVisible: false,
    isRatingModalVisible: false,
    contactModalSubject: '',
    contact: {}
  },
  mutations: {
    toggleConfig (state, key) {
      const leafPath = key.replace(/^.*\./, '')
      const rootPath = key.replace(/((.*)\..*|.*)/, '$2')
      const fullRootPath = rootPath === '' ? 'config' : `config.${rootPath}`
      const model = objectPath.get(state, fullRootPath)
      /* eslint-disable-next-line no-console */
      console.log('hidden-feature', key, !model[leafPath])
      Vue.set(model, leafPath, !model[leafPath])
    },
    toggleContactModal (state) {
      state.isContactModalVisible = !state.isContactModalVisible
    },
    toggleRatingModal (state) {
      state.isRatingModalVisible = !state.isRatingModalVisible
    },
    updateContactModalSubject (state, subject) {
      state.contactModalSubject = subject
    },
    updateApiStatus (state, update) {
      Object.keys(update).forEach( status => {
        const apiName = Object.keys(update[status])[0]
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
    updateContact (state, contact) {
      state.contact = contact
    }
  },
  actions: {
    async log ({ commit }, path) {
      await api.log(path, localStorage.getItem('userId'))
      commit('updateLogCounter')
    },
    async toggleContactModal ({ state, commit, dispatch }, message ) {
      const subject = ( message && message.subject ) || contact.subject.default
      await commit('toggleContactModal')
      await commit('updateContactModalSubject', subject)
      if (state.isContactModalVisible) {
        await dispatch('log', 'contact')
      }
    },
    async toggleRatingModal ({ state, commit, dispatch }) {
      await commit('toggleRatingModal')
      if (state.isRatingModalVisible) {
        await dispatch('log', 'feedback')
      }
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
  },
  plugins: [vuexLocal.plugin]
})
