import Boom from '@hapi/boom'
import { syslogLogger } from '../../../../util/logger.js'

export const checkPayload = ({ uuid, logLabel, nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation }) => {
  const hasPrenoms = prenoms?.length > 0

  if (!nom && !hasPrenoms && !raisonSociale && !siren) {
    syslogLogger.info({ key: 'data_titulaire_vehicule_missing', tag: logLabel, uuid })

    throw Boom.badRequest()
  }

  if (siren && !raisonSociale) {
    syslogLogger.info({ key: 'data_raison_sociale_missing', tag: logLabel, uuid, value: { siren } })

    throw Boom.badRequest()
  }

  if (raisonSociale && !siren) {
    syslogLogger.info({ key: 'data_siren_missing', tag: logLabel, uuid, value: { raisonSociale } })

    throw Boom.badRequest()
  }
}
