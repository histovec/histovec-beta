import api from '@/api'
import {V_TTL} from '../../constants/v'

export default {
  state: {
    id: undefined,
    key: undefined,
    code: undefined,
    v: undefined,
    vExpiry: new Date().getTime(), // expired by default
  },
  getters: {
    vWithExpiry: state => {
      const now = new Date()
      if (now.getTime() > state.vExpiry) {
				return null
			}
      return state.v
    }
  },
  mutations: {
    updateV (state, v) {
      const now = new Date()
      state.v = v
      state.vExpiry = now.getTime() + V_TTL
    },
    updateCode (state, code) {
      state.code = code
    },
    updateKey (state, key) {
      if (key !== state.key) {
        state.key = key
        state.v = undefined
        state.vExpiry = new Date().getTime() // expired by default
      }
    },
    updateId (state, id) {
      if (id !== state.id) {
        state.id = id
        state.v = undefined
        state.vExpiry = new Date().getTime() // expired by default
      }
    },
    clearSIV (state) {
      state.v = undefined
      state.vExpiry = new Date().getTime() // expired by default
      state.key = undefined
      state.code = undefined
      state.id = undefined
    }
  },
  actions: {
    async getSIV ({ commit, state, rootState }, future) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.siv) {
        return
      }

      commit('clearUTAC')

      let response
      if (future) {
        response = await api.getSIVv1(state.id, state.key, localStorage.getItem('userId'))
      } else {
        response = await api.getSIV(state.id, state.key, localStorage.getItem('userId'))
      }
      if (response.success) {
        commit('updateV', response.v)
        if (response.token) {
          commit('updateToken', response.token)
        }
        if (response.utac_id) {
          commit('updateUtacId', response.utac_id)
        }
      }
      return
    },
  }
}