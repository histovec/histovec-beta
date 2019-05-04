import api from '@/api'

export default {
  state: {
    id: undefined,
    key: undefined,
    code: undefined,
    v: undefined
  },
  mutations: {
    updateV (state, v) {
      state.v = v
    },
    updateCode (state, code) {
      state.code = code
    },
    updateKey (state, key) {
      if (key !== state.key) {
        state.key = key
        state.v = undefined
      }
    },
    updateId (state, id) {
      if (id !== state.id) {
        state.id = id
        state.v = undefined
      }
    }
  },
  actions: {
    async getHistoVec ({ commit, state }) {
      if (state.api && state.api.fetching) {
        return
      }
      const response = await api.getHistoVec(state.id, state.key, localStorage.getItem('userId'))
      if (response.success) {
        commit('updateV', response.v)
      }
      return
    }
  }
}