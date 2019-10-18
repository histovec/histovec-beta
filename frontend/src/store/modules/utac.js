import api from '@/api'
import CryptoJS from 'crypto-js'

export default {
  state: {
    ct: undefined,
    token: undefined
  },
  mutations: {
    updateCT (state, ct) {
      state.ct = ct
    },
    updateToken (state, token) {
      state.token = token
    },
    clearUTAC (state) {
      state.ct = undefined
      state.token = undefined
    }
  },
  actions: {
    async getUTAC ({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.utac) {
        return
      }
      const response = await api.getUTAC(
        rootState.siv.id,
        rootState.siv.code,
        state.token,
        CryptoJS.SHA256(rootState.siv.key).toString(CryptoJS.enc.Base64),
        rootState.siv.v.utac_id,
        localStorage.getItem('userId')
      )
      if (response.success) {
        commit('updateCT', response.ct)
      }
      return
    }
  }
}
