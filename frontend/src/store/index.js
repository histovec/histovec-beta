import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import objectPath from 'object-path'
import { v4 as uuidv4 } from 'uuid'

import identity from './modules/identity.js'
import histovec from './modules/histovec.js'

import api from '@/api/index.js'

import contact from '@/assets/json/contact.json'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
})

Vue.use(Vuex)


if (localStorage.getItem('userId') === null) {
  const uuid = uuidv4()
  localStorage.setItem('userId', uuid, 1)
}

export default new Vuex.Store({
  strict: import.meta.env.NODE_ENV !== 'production',
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
      error: {},
    },
    config: {
      ignoreUtacCache: false,
      useCodePartageHistoVec: false,
    },
    configEnabler: {
      ignoreUtacCache: ['ctrl', 'alt', 'a'],
      useCodePartageHistoVec: ['ctrl', 'alt', 'v'],
    },
    isContactModalVisible: false,
    isRatingModalVisible: false,
    contactModalSubject: '',
    lastContactStatusCode: undefined,
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
    updateLogCounter (state) {
      state.logCounter++
    },
    updateContactStatus (state, { status }) {
      state.lastContactStatusCode = status
    },
    resetContactStatus (state) {
      state.lastContactStatusCode = undefined
    },
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
      try {
        const { status } = await api.sendContact(contact)
        commit('updateContactStatus', { status })
      } catch (error) {
        commit('updateContactStatus', {
          status: 500,
        })
      }
    },
    async resetContactStatus ({ commit }) {
      commit('resetContactStatus')
    },
  },
  modules: {
    identity,
    histovec,
  },
  plugins: [vuexLocal.plugin],
})
