import dayjs from 'dayjs'

import { normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation } from '../../../util/dataPreparationFormat.js'
import { hash } from '../../../util/crypto.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../../../constant/type.js'
import { FR_DATE_FORMAT } from '../../../constant/date/format.js'

import config from '../../../config.js'


export const buildReportId = (
  {
    nom = '', prenoms = '', raisonSociale = '', siren = '',
    plaqueImmatriculation = '', numeroFormule = '', dateEmissionCertificatImmatriculation = '',
  },
  {
    typeImmatriculation, typePersonne,
  }
) => {
  const personneId = (
    typePersonne === TYPE_PERSONNE.PARTICULIER
      ? nom + prenoms.join('')
      : raisonSociale + siren
  )

  const dateEmissionCertificatImmatriculationFrance = dateEmissionCertificatImmatriculation ? dayjs(dateEmissionCertificatImmatriculation).format(FR_DATE_FORMAT) : null

  const vehicleId = (
    typeImmatriculation === TYPE_IMMATRICULATION.SIV
      ? plaqueImmatriculation + numeroFormule
      : plaqueImmatriculation + dateEmissionCertificatImmatriculationFrance
  )

  // Control about data validity date
  let dataValidityDate = dayjs().add(-7, 'day')

  if (config.usePreviousMonthForData) {
    dataValidityDate = dataValidityDate.add(-1, 'month')
  }

  const dataValidityMonth = dataValidityDate.format('YYYYMM')

  const rawReportId = `${personneId}${vehicleId}${dataValidityMonth}`

  // /!\ Do NOT change this normalization without changing it in the data side too.
  // Data and code are strongly linked about reportId construction (also called idv) /!\
  const normalizedReportId = normalizeIdvAsDataPreparation(rawReportId)

  const reportId = hash(normalizedReportId)

  return reportId
}

export const buildReportKey = (
  {
    plaqueImmatriculation = '', numeroFormule = '', dateEmissionCertificatImmatriculation = '',
  },
  {
    typeImmatriculation,
  }
) => {
  const dateEmissionCertificatImmatriculationFrance = dateEmissionCertificatImmatriculation ? dayjs(dateEmissionCertificatImmatriculation).format(FR_DATE_FORMAT) : null

  const rawReportKey = (
    typeImmatriculation === TYPE_IMMATRICULATION.SIV
      ? `${plaqueImmatriculation}${numeroFormule}`
      : `${plaqueImmatriculation}${dateEmissionCertificatImmatriculationFrance}`
  )

  // /!\ Do NOT change this normalization without changing it in the data side too.
  // Data and code are strongly linked about reportKey construction (also called key) /!\
  const normalizedReportKey = normalizeKeyAsDataPreparation(rawReportKey)

  const reportKey = hash(normalizedReportKey)

  return reportKey
}
