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
    },
    cleanHistoVec (state) {
      state.v = undefined
      state.key = undefined
      state.code = undefined
      state.id = undefined
    }
  },
  actions: {
    async getHistoVec ({ commit, state, rootState }, future) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.histovec) {
        return
      }
      let response
      if (future) {
        response = await api.getHistoVecV1(state.id, state.key, localStorage.getItem('userId'))
      } else {
        response = await api.getHistoVec(state.id, state.key, localStorage.getItem('userId'))
      }
      if (response.success) {
        commit('updateV', response.v)
        if (response.token) {
          commit('updateToken', response.token)
        }
      }
      return
    },
    async getHistoVecAndOtc ({ commit, state, rootState}) {
      if (rootState.api && rootState.api.fetching && ( rootState.api.fetching.histovec || rootState.api.fetching.otc )) {
        return
      }
      await api.getHistoVecAndOtc(state.id, state.key, rootState.identity.plaque, localStorage.getItem('userId'),
        {
          histovec: ((response) => { if (response.success) { commit('uptateV', response.v) } }),
          otc: ((response) => { if (response.success) { commit('uptateCT', response.ct) } })
        }
      )
    }
  }
}