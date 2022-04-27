import dayjs from 'dayjs'

import { normalizeIdvAsDataPreparation, normalizeKeyAsDataPreparation } from '../../../util/dataPreparationFormat.js'
import { hash } from '../../../util/crypto.js'
import { checkId, checkKey } from './check/reportByCode.js'
import { appLogger } from '../../../util/logger.js'
import { TYPE_IMMATRICULATION, TYPE_PERSONNE } from '../../../constant/type.js'
import { FR_DATE_FORMAT } from '../../../constant/date/format.js'
import config from '../../../config.js'

export const buildIdAndKey = (code) => {
  if (!code) {
    return { isInvalidCode: false }
  }
  const chunks = code.split('-')
  if (chunks.length !== 2) {
    appLogger.info(`[Code_HistoVec] invalid_code ${code}`)
    return { isInvalidCode: true }
  }

  const [id, key] = chunks

  if (!checkId(id) || !checkKey(key)) {
    appLogger.info(`[Code_HistoVec] invalid_id_or_key ${code}`)
    return { isInvalidCode: true }
  }

  return {
    id,
    key,
  }
}

export const buildReportId = (
  {
    nom = '', prenoms = '', raisonSociale = '', siren = '',
    numeroImmatriculation = '', numeroFormule = '', dateEmissionCertificatImmatriculation = '',
  },
  {
    typeImmatriculation, typePersonne,
  },
) => {
  const personneId = (
    typePersonne === TYPE_PERSONNE.PARTICULIER
      ? nom + prenoms.join('')
      : raisonSociale + siren
  )

  const dateEmissionCertificatImmatriculationFrance = dateEmissionCertificatImmatriculation ? dayjs(dateEmissionCertificatImmatriculation).format(FR_DATE_FORMAT) : null

  const vehicleId = (
    typeImmatriculation === TYPE_IMMATRICULATION.SIV
      ? numeroImmatriculation + numeroFormule
      : numeroImmatriculation + dateEmissionCertificatImmatriculationFrance
  )

  // Control about data validity date
  let dataValidityDate = dayjs().add(-7, 'day')

  if (config.usePreviousMonthForData) {
    dataValidityDate = dataValidityDate.add(-config.previousMonthShift, 'month')
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
    numeroImmatriculation = '', numeroFormule = '', dateEmissionCertificatImmatriculation = '',
  },
  {
    typeImmatriculation,
  },
) => {
  const dateEmissionCertificatImmatriculationFrance = dateEmissionCertificatImmatriculation ? dayjs(dateEmissionCertificatImmatriculation).format(FR_DATE_FORMAT) : null

  const rawReportKey = (
    typeImmatriculation === TYPE_IMMATRICULATION.SIV
      ? `${numeroImmatriculation}${numeroFormule}`
      : `${numeroImmatriculation}${dateEmissionCertificatImmatriculationFrance}`
  )

  // /!\ Do NOT change this normalization without changing it in the data side too.
  // Data and code are strongly linked about reportKey construction (also called key) /!\
  const normalizedReportKey = normalizeKeyAsDataPreparation(rawReportKey)

  const reportKey = hash(normalizedReportKey)

  return reportKey
}
