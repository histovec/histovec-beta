import Vue from 'vue'
import Vuex from 'vuex'
import identity from './modules/identity.js'
import siv from './modules/siv.js'
import utac from './modules/utac.js'
import VuexPersistence from 'vuex-persist'
import objectPath from 'object-path'

import api from '@/api'

import contact from '@/assets/json/contact.json'

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

Vue.use(Vuex)

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}

function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

if (localStorage.getItem('userId') === null) {
  const uuid = guid()
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
      allTabs: false,
      utac: true,
      utacGraph: true,
      v1: true,
      modalMail: true,
    },
    configEnabler: {
      allTabs: ['ctrl', 'alt', 'a'],
      modalMail: ['ctrl', 'alt', 'b'],
      v1: ['ctrl','alt','v'],
      utac: ['ctrl', 'alt', 'o'],
      utacGraph: ['ctrl', 'alt', 'g']
    },
    modalForm: false,
    modalFormMode: contact.mode.contact,
    modalFormSubject: '',
    feedback: {},
    contact: {}
  },
  mutations: {
    toggleConfig (state, key) {
      let leafPath = key.replace(/^.*\./, '')
      let rootPath = key.replace(/((.*)\..*|.*)/, '$2')
      rootPath = rootPath === '' ? 'config' : `config.${rootPath}`
      let model = objectPath.get(state, rootPath)
      /* eslint-disable-next-line no-console */
      console.log('hidden-feature', key, !model[leafPath])
      Vue.set(model, leafPath, !model[leafPath])
    },
    toggleModalForm (state) {
      state.modalForm = !state.modalForm
    },
    updateModalFormMode (state, mode) {
      state.modalFormMode = mode
    },
    updateModalFormSubject (state, subject) {
      state.modalFormSubject = subject
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
    async toggleModalForm ({ state, commit, dispatch }, message ) {
      let mode = ( message && message.mode ) || contact.mode.contact
      let subject = ( message && message.subject ) || contact.mode.subject
      await commit('toggleModalForm')
      await commit('updateModalFormMode', mode)
      await commit('updateModalFormSubject', subject)
      if (state.modalForm && mode) {
        await dispatch('log', contact.route[mode])
      }
    },
    async sendFeedback ({ state, commit }, feedback) {
      await api.sendFeedback(feedback, state.config.v1)
      commit('updateFeedback')
    },
    async sendContact ({ state, commit }, contact) {
      await api.sendContact(contact, state.config.v1)
      commit('updateContact')
    },
    initApiStatus ({ commit }, apiName) {
      commit('initApiStatus', apiName)
    }
  },
  modules: {
    identity,
    siv,
    utac
  },
  plugins: [vuexLocal.plugin]
})
