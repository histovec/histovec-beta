import api from '@/api/index.js'
import { buildReportByDataPayload, buildReportByCodePayload } from '@/api/utils/index.js'

import { vehiculeMapping, controlesTechniquesMapping } from '@/utils/mapping/index.js'
import { getTomorrowTime, getTodayTime } from '@/utils/date.js'
import { labelizeControlesTechniques } from '@/utils/vehicle/formatControlesTechniques.js'

import { TYPE_IMMATRICULATION } from '../constants/type'


const reportWithExpiry = (reportId) => {

  if (reportId !== sessionStorage.getItem('reportId')) {
    return null
  }

  const now = getTodayTime()

  if (now >= Number(sessionStorage.getItem('reportExpiry'))) {
      return null
  }

  return {

    report: {
      controlesTechniques: JSON.parse(sessionStorage.getItem('controlesTechniques')),
      vehicule: JSON.parse(sessionStorage.getItem('vehicule')),
    },
    status: parseInt(sessionStorage.getItem('status')),
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

  sessionStorage.setItem('status', status)
  sessionStorage.setItem('reportId', reportId)

  if (status !== 200 && status !== 404) {
    // Don't cache report if api send an error
    return
  }

  if (!vehicule) {
        sessionStorage.setItem('vehicule', null)
        sessionStorage.setItem('controlesTechniques', null)
        sessionStorage.setItem('reportExpiry', getTomorrowTime())
        return
  }

  const mappedVehicule = vehiculeMapping(vehicule)
  const mappedControlesTechniques = controlesTechniquesMapping(controles_techniques)
  const labelizedControlesTechniques = labelizeControlesTechniques(mappedControlesTechniques)
  sessionStorage.setItem('vehicule', JSON.stringify(mappedVehicule))
  sessionStorage.setItem('controlesTechniques', JSON.stringify(labelizedControlesTechniques))
  sessionStorage.setItem('reportExpiry', getTomorrowTime())

}

export default {
  getHolderReport: async ({ id, formData }, { ignoreUtacCache }) => {
    const cachedReport = reportWithExpiry(id)

    if (cachedReport) {
      api.log('/holder/cached')
      return cachedReport
    }

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
        nom: nomEtPrenoms,
        prenoms: [''],
        raisonSociale,
        siren: numeroSiren,
        numeroImmatriculation,
        dateEmissionCertificatImmatriculation,
      }
    }

    const payload = buildReportByDataPayload(
      localStorage.getItem('userId'),
      data,
      { typeImmatriculation, typePersonne, ignoreUtacCache },
    )

    try {
      // requete
      const { report, status } = await api.getHolderReport(payload)

      if (status !== 200) {
        api.log('/holder/notFound')
      }
      updateReport({ report, reportId: id, status })
    } catch (error) {
      api.log('/holder/unavailable')
      updateReport({ report: {}, reportId: null, status: 500 })
    }

    return reportWithExpiry(id)
  },
  getBuyerReport: async ({ id, key }, { ignoreUtacCache }) => {
    const cachedReport = reportWithExpiry(id)

    if (cachedReport) {
      api.log('/buyer/cached')
      return cachedReport
    }

    const payload = buildReportByCodePayload(
      localStorage.getItem('userId'),
      { id, key },
      { ignoreUtacCache },
    )

    try {
      const { report, status } = await api.getBuyerReport(payload)

      if (status !== 200) {
        api.log('/buyer/notFound')
      }
      updateReport({ report, reportId: id, status })
    } catch (error) {
      api.log('/buyer/unavailable')
      updateReport({ report: {}, reportId: null, status: 500 })
    }

    return reportWithExpiry(id)
  },
}
