import api from '@/api'
import CryptoJS from 'crypto-js'

import { labelizeTechnicalControls }  from '../../utils/vehicle/technicalControlFormat'

export default {
  state: {
    ctData: {},
    token: undefined
  },
  mutations: {
    updateCT (state, ctData) {
      state.ctData = {
        ...ctData,
        ct: labelizeTechnicalControls(ctData.ct),
      }
    },
    updateToken (state, token) {
      state.token = token
    },
    clearUTAC (state) {
      state.ctData = {}
      state.token = undefined
    }
  },
  actions: {
    async getUTAC ({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.utac) {
        return
      }

      commit('clearUTAC')

      const response = await api.getUTAC(
        rootState.siv.id,
        rootState.siv.code,
        state.token,
        CryptoJS.SHA256(rootState.siv.key).toString(CryptoJS.enc.Base64),
        rootState.siv.v.utac_id,
        localStorage.getItem('userId')
      )

      if (response.success) {
        commit('updateCT', response.ctData)
      }
      if (!response.success && response.status !== 404 && response.status !== 406) {
        commit('updateCT', {
          error: 'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.'
        })
      }
    }
  }
}
