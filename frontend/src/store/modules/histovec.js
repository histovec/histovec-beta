import api from '@/api/index.js'
import { buildReportByDataPayload, buildReportByCodePayload } from '@/api/utils/index.js'
import { vehiculeMapping, controlesTechniquesMapping } from '@/utils/mapping/index.js'
import { getTomorrowTime, getTodayTime } from '@/utils/date.js'
import { labelizeControlesTechniques } from '@/utils/vehicle/formatControlesTechniques.js'
import { TYPE_PERSONNE } from '@/constants/type.js'


export default {
  state: {
    id: undefined,
    key: undefined,
    report: {
      vehicule : null,
      controlesTechniques: null,
    },
    reportExpiry: getTodayTime(), // expired by default
    lastReportStatusCode: undefined,
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
      report: {
        vehicule,
        controles_techniques,
      } = {
        vehicule: null,
        controles_techniques: null,
      },
      status,
    }) {
      state.lastReportStatusCode = status

      if (status !== 200 && status !== 404) {
        // Don't cache report if api send an error
        return
      }

      if (!vehicule) {
        state.report = {
          vehicule: null,
          controlesTechniques: null,
        }

        state.reportExpiry = getTomorrowTime()
        return
      }

      const mappedVehicule = vehiculeMapping(vehicule)
      const mappedControlesTechniques = controlesTechniquesMapping(controles_techniques)
      const labelizedControlesTechniques = labelizeControlesTechniques(mappedControlesTechniques)

      state.report = {
        vehicule: mappedVehicule,
        controlesTechniques: labelizedControlesTechniques,
      }

      state.reportExpiry = getTomorrowTime()
    },
    updateId(state, id) {
      if (id !== state.id) {
        state.id = id
        state.report = {
          vehicule : null,
          controlesTechniques: null,
        }
        state.lastReportStatusCode = null
        state.reportExpiry = getTodayTime() // expired by default
      }
    },
    updateKey(state, key) {
      if (key !== state.key) {
        state.key = key
        state.report = {
          vehicule : null,
          controlesTechniques: null,
        }
        state.lastReportStatusCode = null
        state.reportExpiry = getTodayTime() // expired by default
      }
    },
    clearReport(state) {
      state.id = undefined
      state.key = undefined
      state.report = {
        vehicule : null,
        controlesTechniques: null,
      }
      state.lastReportStatusCode = null
      state.reportExpiry = getTodayTime() // expired by default
    }
  },
  actions: {
    async getHolderReport({ commit, rootState }) {
      const { ignoreUtacCache } = rootState.config

      const {
        nom = '',
        prenom = '',
        raisonSociale = '',
        siren = '',
        plaque = '',
        formule = '',
        dateCertificat = '',
        typeImmatriculation = '',
      } = rootState.identity

      const data = {
        nom,
        prenoms: [prenom],
        raisonSociale,
        siren,
        numeroImmatriculation: plaque,
        numeroFormule: formule,
        dateEmissionCertificatImmatriculation: dateCertificat,
      }

      const typePersonne = nom ? TYPE_PERSONNE.PARTICULIER : TYPE_PERSONNE.PRO
      const payload = buildReportByDataPayload(
        data,
        { typeImmatriculation, typePersonne, ignoreUtacCache },
      )

      try {
        const { report, status } = await api.getHolderReport(
          localStorage.getItem('userId'),
          payload
        )

        commit('updateReport', {
          report,
          status,
        })
      } catch (error) {
        commit('updateReport', {
          report: null,
          status: 500,
        })
      }
    },
    async getBuyerReport({ commit, state, rootState }) {
      const { ignoreUtacCache } = rootState.config

      const {
        id,
        key,
      } = state

      const data = {
        id,
        key,
      }

      const payload = buildReportByCodePayload(data, { ignoreUtacCache })

      try {
        const { report, status } = await api.getBuyerReport(
          localStorage.getItem('userId'),
          payload
        )

        commit('updateReport', {
          report,
          status,
        })
      } catch (error) {
        commit('updateReport', {
          report: null,
          status: 500,
        })
      }
    },
  }
}
