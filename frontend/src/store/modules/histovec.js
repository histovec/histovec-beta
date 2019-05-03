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
      state.key = key
    },
    updateId (state, id) {
      state.id = id
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