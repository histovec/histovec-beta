import api from '@/api'
import {V_TTL} from '../../constants/v'

export default {
  state: {
    id: undefined,
    key: undefined,
    code: undefined,
    vehicleData: undefined,
    vehicleDataExpiry: new Date().getTime(), // expired by default
  },
  getters: {
    vehicleDataWithExpiry: state => {
      const now = new Date()
      if (now.getTime() > state.vehicleDataExpiry) {
				return null
			}
      return state.vehicleData
    }
  },
  mutations: {
    updateVehicleData (state, vehicleData) {
      const now = new Date()
      state.vehicleData = vehicleData
      state.vehicleDataExpiry = now.getTime() + V_TTL
    },
    updateCode (state, code) {
      state.code = code
    },
    updateKey (state, key) {
      if (key !== state.key) {
        state.key = key
        state.vehicleData = undefined
        state.vehicleDataExpiry = new Date().getTime() // expired by default
      }
    },
    updateId (state, id) {
      if (id !== state.id) {
        state.id = id
        state.vehicleData = undefined
        state.vehicleDataExpiry = new Date().getTime() // expired by default
      }
    },
    clearSIV (state) {
      state.vehicleData = undefined
      state.vehicleDataExpiry = new Date().getTime() // expired by default
      state.key = undefined
      state.code = undefined
      state.id = undefined
    }
  },
  actions: {
    async getVehicleData ({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.siv) {
        return
      }

      commit('clearUTAC')

      const response = await api.getVehicleData(state.id, state.key, localStorage.getItem('userId'))
      if (response.success) {
        commit('updateVehicleData', response.vehicleData)
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