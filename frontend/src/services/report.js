import api from '@/api/index.js'
import { buildReportByDataPayload, buildReportByCodePayload } from '@/api/utils/index.js'

import { vehiculeMapping, controlesTechniquesMapping } from '@/utils/mapping/index.js'
import { getTomorrowTime, getTodayTime } from '@/utils/date.js'
import { labelizeControlesTechniques } from '@/utils/vehicle/formatControlesTechniques.js'

import { TYPE_IMMATRICULATION } from '../constants/type'


const reportCache = {
  report: {
    vehicule : null,
    controlesTechniques: null,
  },
  reportId: null,
  reportExpiry: getTodayTime(), // expired by default
  lastReportStatusCode: null,
}

const reportWithExpiry = (reportId) => {
  if (reportId !== reportCache.reportId) {
    return null
  }

  const now = getTodayTime()

  if (now >= reportCache.reportExpiry) {
    return null
  }

  return {
    report: reportCache.report,
    status: reportCache.lastReportStatusCode,
  }
}

const updateReport = (
  {
    report: {
      vehicule,
      controles_techniques,
    } = {
      vehicule: null,
      controles_techniques: null,
    },
    reportId,
    status,
  },
) => {
  reportCache.lastReportStatusCode = status
  reportCache.reportId = reportId

  if (status !== 200 && status !== 404) {
    // Don't cache report if api send an error
    return
  }

  if (!vehicule) {
    reportCache.report = {
      vehicule: null,
      controlesTechniques: null,
    }

    reportCache.reportExpiry = getTomorrowTime()
    return
  }

  const mappedVehicule = vehiculeMapping(vehicule)
  const mappedControlesTechniques = controlesTechniquesMapping(controles_techniques)
  const labelizedControlesTechniques = labelizeControlesTechniques(mappedControlesTechniques)

  reportCache.report = {
    vehicule: mappedVehicule,
    controlesTechniques: labelizedControlesTechniques,
  }

  reportCache.reportExpiry = getTomorrowTime()
}

export default {
  getHolderReport: async ({ id, formData }, { ignoreUtacCache }) => {
    const {
      typeImmatriculation,
      typePersonne,
    } = formData

    let data

    if (typeImmatriculation === TYPE_IMMATRICULATION.SIV) {
      const {
        siv: {
          titulaire: {
            particulier: {
              nom,
              prenoms,
            },
            personneMorale : {
              raisonSociale,
              numeroSiren,
            },
          },
          numeroImmatriculation,
          numeroFormule,
        },
      } = formData

      data = {
        nom,
        prenoms: [prenoms],
        raisonSociale,
        siren: numeroSiren,
        numeroImmatriculation,
        numeroFormule,
      }
    }

    if (typeImmatriculation === TYPE_IMMATRICULATION.FNI) {
      const {
        fni: {
          titulaire: {
            particulier: {
              nomEtPrenoms,
            },
            personneMorale: {
              raisonSociale,
              numeroSiren,
            },
          },
          numeroImmatriculation,
          dateEmissionCertificatImmatriculation,
        },
      } = formData

      data = {
        prenoms: [nomEtPrenoms],
        raisonSociale,
        siren: numeroSiren,
        numeroImmatriculation,
        dateEmissionCertificatImmatriculation,
      }
    }

    const payload = buildReportByDataPayload(
      data,
      { typeImmatriculation, typePersonne, ignoreUtacCache },
    )

    try {
      const { report, status } = await api.getHolderReport({
        uuid: localStorage.getItem('userId'),
        payload,
      })

      updateReport({ report, reportId: id, status })
    } catch (error) {
      updateReport({ report: null, reportId: null, status: 500 })
    }

    return reportWithExpiry(id)
  },
  getBuyerReport: async ({ id, key }, { ignoreUtacCache }) => {
    const cachedReport = reportWithExpiry(id)

    if (cachedReport) {
      return cachedReport
    }

    const payload = buildReportByCodePayload(
      { id, key },
      { ignoreUtacCache },
    )

    try {
      const { report, status } = await api.getBuyerReport({
        uuid: localStorage.getItem('userId'),
        payload,
      })

      updateReport({ report, reportId: id, status })
    } catch (error) {
      updateReport({ report: null, reportId: null, status: 500 })
    }

    return reportWithExpiry(id)
  },
}
