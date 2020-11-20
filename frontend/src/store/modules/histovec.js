import api from '@/api'
import { labelizeTechnicalControls } from '../../utils/vehicle/technicalControlFormat'
import { V_TTL } from '../../constants/v'

export default {
  state: {
    id: undefined,
    key: undefined,
    code: undefined,
    report: undefined,
    reportExpiry: new Date().getTime(), // expired by default
  },
  getters: {
    reportWithExpiry: state => {
      const now = new Date()
      if (now.getTime() > state.reportExpiry) {
        return null
      }
      return state.report
    }
  },
  mutations: {
    updateReport(state, {
      sivData,
      utacData: { ct, ctUpdateDate, utacError },
    }) {
      const now = new Date()

      const ctError = (
        utacError ?
          'Un problème est survenu lors de la récupération des contrôles techniques. Veuillez réessayer plus tard.' :
          ''
      )

      state.report = {
        sivData,
        utacData: (
          utacError ?
            {
              ctError,
            } :
            {
              ct: labelizeTechnicalControls(ct),
              ctUpdateDate,
            }
        ),
      }
      state.reportExpiry = now.getTime() + V_TTL
    },
    updateCode(state, code) {
      state.code = code
    },
    updateKey(state, key) {
      if (key !== state.key) {
        state.key = key
        state.report = undefined
        state.reportExpiry = new Date().getTime() // expired by default
      }
    },
    updateId(state, id) {
      if (id !== state.id) {
        state.id = id
        state.report = undefined
        state.reportExpiry = new Date().getTime() // expired by default
      }
    },
    clearReport(state) {
      state.id = undefined
      state.key = undefined
      state.code = undefined
      state.report = undefined
      state.reportExpiry = new Date().getTime() // expired by default
    }
  },
  actions: {
    async getReport({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.report) {
        return
      }

      const {
        sivData,
        utacData,
        success,
      } = await api.getReport(
        state.id,
        state.key,
        localStorage.getItem('userId')
      )

      if (success) {
        commit('updateReport', {
          sivData,
          utacData,
        })
      }
    },
  }
}