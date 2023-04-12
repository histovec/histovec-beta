import Boom from '@hapi/boom'
import { syslogLogger } from '../../../../util/logger.js'

export const checkPayload = ({ uuid, logLabel, nom, prenoms, raisonSociale, siren, numeroImmatriculation, numeroFormule, dateEmissionCertificatImmatriculation }) => {
  const hasPrenoms = prenoms?.length > 0

  if (!nom && !hasPrenoms && !raisonSociale && !siren) {
    syslogLogger.info({ key: 'data_missing informations manquantes sur le titulaire du vehicule', tag: logLabel, uuid })

    throw Boom.badRequest()
  }

  if (siren && !raisonSociale) {
    syslogLogger.info({ key: 'data_missing numero de siren manquant sur le titulaire du vehicule', tag: logLabel, uuid, value: { raisonSociale } })

    throw Boom.badRequest()
  }

  if (raisonSociale && !siren) {
    syslogLogger.info({ key: 'data_missing raison sociale manquant sur le titulaire du vehicule', tag: logLabel, uuid, value: { siren } })

    throw Boom.badRequest()
  }
}
