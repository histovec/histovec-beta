import api from '@/api'

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
    clearTechControl (state) {
      state.ct = undefined
      state.token = undefined
    }
  },
  actions: {
    async getTechControl ({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.utac) {
        return
      }
      const response = await api.getUTAC(rootState.histovec.id, rootState.histovec.code, state.token, rootState.histovec.key, rootState.histovec.utacId, localStorage.getItem('userId'))
      if (response.success) {
        commit('updateCT', response.ct)
      }
      return
    }
  }
}
