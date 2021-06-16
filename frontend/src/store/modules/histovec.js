import api from '@/api'
import { labelizeTechnicalControls } from '../../utils/vehicle/technicalControlFormat'

const getTomorrowTime = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return new Date(tomorrow.toDateString()).getTime()
}

const getTodayTime = () => {
  const today = new Date()
  return new Date(today.toDateString()).getTime()
}

export default {
  state: {
    id: undefined,
    key: undefined,
    code: undefined,
    report: undefined,
    reportExpiry: getTodayTime(), // expired by default
  },
  getters: {
    reportWithExpiry: state => {
      const now = getTodayTime()

      if (now >= state.reportExpiry) {
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

      state.reportExpiry = getTomorrowTime()
    },
    updateCode(state, code) {
      state.code = code
    },
    updateKey(state, key) {
      if (key !== state.key) {
        state.key = key
        state.report = undefined
        state.reportExpiry = getTodayTime() // expired by default
      }
    },
    updateId(state, id) {
      if (id !== state.id) {
        state.id = id
        state.report = undefined
        state.reportExpiry = getTodayTime() // expired by default
      }
    },
    clearReport(state) {
      state.id = undefined
      state.key = undefined
      state.code = undefined
      state.report = undefined
      state.reportExpiry = getTodayTime() // expired by default
    }
  },
  actions: {
    async getReport({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.report) {
        return
      }

      // eslint-disable-next-line no-console
      console.log('useUtacForVin = ', rootState.config.useVinForUtac)

      const {
        sivData,
        utacData,
        success,
      } = await api.getReport(
        state.id,
        state.key,
        localStorage.getItem('userId'),
        rootState.config.useVinForUtac
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