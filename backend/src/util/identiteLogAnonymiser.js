import { anonymizeIdentite } from './anonymiserData.js'
import { syslogLogger } from './logger.js'
import { TYPE_IMMATRICULATION } from '../constant/type.js'

export const anonymizedIdentite = (identiteLog) => {
  const anonymizedIdentite =
    {
      alreadyHasIdAndKey: identiteLog.alreadyHasIdAndKey,
      uuid: identiteLog.uuid,
      anonymizedNom: identiteLog.nom ? anonymizeIdentite(identiteLog.nom) : undefined,
      anonymizedPrenom: (identiteLog.prenoms && identiteLog.typeImmatriculation === TYPE_IMMATRICULATION.SIV) ? anonymizeIdentite(identiteLog.prenoms[0]) : undefined,
      anonymizedRaisonSociale: identiteLog.raisonSociale ? anonymizeIdentite(identiteLog.raisonSociale) : undefined,
      anonymizedSiren: identiteLog.siren ? anonymizeIdentite(identiteLog.siren) : undefined,
      anonymizedNumeroImmatriculation: identiteLog.numeroImmatriculation ? anonymizeIdentite(identiteLog.numeroImmatriculation) : undefined,
      anonymizedNumeroFormule: identiteLog.numeroFormule ? anonymizeIdentite(identiteLog.numeroFormule) : undefined,
      dateEmissionCertificatImmatriculation: identiteLog.dateEmissionCertificatImmatriculation,
      id: identiteLog.id,
      key: identiteLog.key,
    }
  syslogLogger.info({ key: 'payload_data', tag: identiteLog.logLabel, value: { anonymizedIdentite } })
  return {
    anonymizedIdentite,
  }
}
